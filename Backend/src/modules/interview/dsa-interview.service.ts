import { Types } from "mongoose";
import { Interview, IInterview } from "./interview.model";
import { generateDailyProblemSet } from "@/modules/problem/problem.service";
import { createSubmission } from "@/modules/submission/submission.service";
import { evaluateDsaSubmission } from "@/modules/evaluation/evaluation.service";
import { IProblem } from "@/modules/problem/problem.model";
import { INTERVIEW_TYPES, SUBMISSION_SOURCES, DSA_TIME_LIMIT_MS, ProblemDifficulty } from "@/config/constants";
import { AppError } from "@/shared/errors/AppError";
import { buildProblemPresentationMessage } from "@/ai/prompts/dsa-interviewer.prompt";
import { getAIProvider } from "@/ai/ai.factory";
import { safeGenerateText } from "@/ai/guardrails/safe-generate";
import { DSA_INTERVIEWER_SYSTEM_PROMPT, buildClarificationContext } from "@/ai/prompts/dsa-interviewer.prompt";

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
