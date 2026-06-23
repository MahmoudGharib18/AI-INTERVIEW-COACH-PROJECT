import { getAIProvider } from "#/ai/ai.factory.js";
import { safeGenerateText } from "#/ai/guardrails/safe-generate.js";
import { DSA_INTERVIEWER_SYSTEM_PROMPT, buildClarificationContext, buildProblemPresentationMessage } from "#/ai/prompts/dsa-interviewer.prompt.js";
import { DSA_TIME_LIMIT_MS, INTERVIEW_TYPES, ProblemDifficulty, SUBMISSION_SOURCES } from "#/config/constants.js";
import { evaluateDsaSubmission } from "#/modules/evaluation/evaluation.service.js";
import { IInterview, Interview } from "#/modules/interview/interview.model.js";
import { IProblem } from "#/modules/problem/problem.model.js";
import { generateDailyProblemSet } from "#/modules/problem/problem.service.js";
import { createSubmission } from "#/modules/submission/submission.service.js";
import { AppError } from "#/shared/errors/AppError.js";
import { Types } from "mongoose";

export const startDsaInterview = async (sessionId: Types.ObjectId): Promise<{ interview: IInterview; problems: IProblem[] }> => {
	const { easy, medium, hard } = await generateDailyProblemSet();
	const problems = [easy, medium, hard]; // fixed sequence: easy -> medium -> hard

	const interview = await Interview.create({
		session: sessionId,
		type: INTERVIEW_TYPES.DSA,
		questions: problems.map((p) => ({
			question: buildProblemPresentationMessage(p),
			answer: "",
			presentedAt: new Date(),
		})),
	});

	return { interview, problems };
};

export const submitDsaAnswer = async (interviewId: string, questionIndex: number, userId: Types.ObjectId, problemId: Types.ObjectId, problem: IProblem, code: string, language: string): Promise<IInterview> => {
	const interview = await Interview.findById(interviewId);
	if (!interview) throw new AppError("Interview not found", 404);

	const currentIndex = interview.questions.findIndex((q) => !q.answer);

	if (questionIndex !== currentIndex) {
		throw new AppError("Submissions must be made in order. Complete the current problem first.", 400);
	}

	const questionEntry = interview.questions[questionIndex];
	const timeLimitMs = DSA_TIME_LIMIT_MS[problem.difficulty as ProblemDifficulty];
	const elapsedMs = Date.now() - questionEntry.presentedAt.getTime();

	if (elapsedMs > timeLimitMs) {
		// time's up — auto-submit whatever code they have (possibly empty) and evaluate as-is,
		// rather than silently rejecting and leaving them stuck with no way to proceed
		const submission = await createSubmission(userId, problemId, code, language, SUBMISSION_SOURCES.DAILY_SESSION);

		const evaluation = await evaluateDsaSubmission(submission._id, problem, code, language);

		questionEntry.answer = code || "(no submission — time expired)";
		questionEntry.evaluation = evaluation._id;
		await interview.save();

		throw new AppError("Time limit exceeded for this problem. Your submission was recorded and evaluated, but the time limit was breached.", 408);
	}

	const submission = await createSubmission(userId, problemId, code, language, SUBMISSION_SOURCES.DAILY_SESSION);

	const evaluation = await evaluateDsaSubmission(submission._id, problem, code, language);

	questionEntry.answer = code;
	questionEntry.evaluation = evaluation._id;
	await interview.save();

	return interview;
};

export const askDsaClarification = async (interviewId: string, questionIndex: number, problem: IProblem, candidateQuestion: string): Promise<{ response: string; wasFlagged: boolean }> => {
	const interview = await Interview.findById(interviewId);
	if (!interview) throw new AppError("Interview not found", 404);

	const questionEntry = interview.questions[questionIndex];
	if (!questionEntry) throw new AppError("Invalid question index", 400);

	if (questionEntry.answer) {
		throw new AppError("This problem has already been submitted — no further clarifications allowed", 400);
	}

	const provider = getAIProvider();

	const priorClarifications = questionEntry.clarifications.map((c) => ({
		question: c.question,
		response: c.response,
	}));

	const result = await safeGenerateText(provider, {
		messages: [
			{ role: "system", content: DSA_INTERVIEWER_SYSTEM_PROMPT },
			{
				role: "user",
				content: buildClarificationContext(problem, candidateQuestion, priorClarifications),
			},
		],
		temperature: 0.4, // a bit more deterministic than free chat — this is rule-bound dialogue
	});

	questionEntry.clarifications.push({
		question: candidateQuestion,
		response: result.text,
		wasFlagged: result.wasFlagged,
		usedFallback: result.usedFallback,
		askedAt: new Date(),
	});

	await interview.save();

	return { response: result.text, wasFlagged: result.wasFlagged };
};

export const getDsaInterviewById = async (interviewId: string): Promise<IInterview> => {
	const interview = await Interview.findById(interviewId).populate("questions.evaluation");
	if (!interview) throw new AppError("Interview not found", 404);
	return interview;
};

export const completeDsaInterview = async (interviewId: string): Promise<IInterview> => {
	const interview = await Interview.findById(interviewId).populate("questions.evaluation");
	if (!interview) throw new AppError("Interview not found", 404);

	const evaluations = interview.questions.map((q) => q.evaluation as any).filter(Boolean);

	if (evaluations.length !== interview.questions.length) {
		throw new AppError("Cannot complete DSA interview — not all problems have been submitted", 400);
	}

	const avgScore = Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length);

	// const allStrengths = evaluations.flatMap((e) => e.strengths);
	// const allWeaknesses = evaluations.flatMap((e) => e.weaknesses);
	const combinedFeedback = evaluations.map((e) => e.feedback).join(" ");

	interview.overallScore = avgScore;
	interview.overallFeedback = combinedFeedback;
	interview.completedAt = new Date();
	await interview.save();

	return interview;
};
