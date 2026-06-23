import { getAIProvider } from "#/ai/ai.factory.js";
import { safeGenerateText } from "#/ai/guardrails/safe-generate.js";
import { TECHNICAL_INTERVIEWER_SYSTEM_PROMPT, buildNextQuestionPrompt } from "#/ai/prompts/technical-interviewer.prompt.js";
import { INTERVIEW_TYPES, TECHNICAL_INTERVIEW_TIME_LIMIT_MS } from "#/config/constants.js";
import { IEvaluation } from "#/modules/evaluation/evaluation.model.js";
import { evaluateTechnicalAnswer, generateTechnicalFinalSummary } from "#/modules/evaluation/evaluation.service.js";
import { IInterview, Interview } from "#/modules/interview/interview.model.js";
import { AppError } from "#/shared/errors/AppError.js";
import { Types } from "mongoose";


export const startTechnicalInterview = async (sessionId: Types.ObjectId): Promise<IInterview> => {
	const provider = getAIProvider();

	const result = await safeGenerateText(provider, {
		messages: [
			{ role: "system", content: TECHNICAL_INTERVIEWER_SYSTEM_PROMPT },
			{ role: "user", content: buildNextQuestionPrompt([], true) },
		],
	});

	const interview = await Interview.create({
		session: sessionId,
		type: INTERVIEW_TYPES.TECHNICAL,
		questions: [
			{
				question: result.text,
				answer: "",
				presentedAt: new Date(),
			},
		],
	});

	return interview;
};

export const submitTechnicalAnswer = async (interviewId: string, answer: string): Promise<{ interview: IInterview; evaluation: IEvaluation }> => {
	const interview = await Interview.findById(interviewId);
	if (!interview) throw new AppError("Interview not found", 404);

	const currentIndex = interview.questions.findIndex((q) => !q.answer);
	if (currentIndex === -1) {
		throw new AppError("No pending question to answer on this interview", 400);
	}

	const currentQuestion = interview.questions[currentIndex];

	const evaluation = await evaluateTechnicalAnswer(currentQuestion.question, answer);

	currentQuestion.answer = answer;
	currentQuestion.evaluation = evaluation._id;
	await interview.save();

	return { interview, evaluation };
};

export const getNextTechnicalQuestion = async (interviewId: string): Promise<{ interview: IInterview; question: string | null; timeExpired: boolean }> => {
	const interview = await Interview.findById(interviewId);
	if (!interview) throw new AppError("Interview not found", 404);

	const allAnswered = interview.questions.every((q) => q.answer);
	if (!allAnswered) {
		throw new AppError("Current question must be answered before requesting the next one", 400);
	}

	const elapsedMs = Date.now() - interview.startedAt.getTime();

	if (elapsedMs >= TECHNICAL_INTERVIEW_TIME_LIMIT_MS) {
		// soft cutoff: the question that was just answered is allowed to stand as the last one.
		// no new question is generated — frontend should now call /complete instead.
		return { interview, question: null, timeExpired: true };
	}

	const provider = getAIProvider();

	const conversationHistory = interview.questions.map((q) => ({
		question: q.question,
		answer: q.answer,
	}));

	const result = await safeGenerateText(provider, {
		messages: [
			{ role: "system", content: TECHNICAL_INTERVIEWER_SYSTEM_PROMPT },
			{ role: "user", content: buildNextQuestionPrompt(conversationHistory, false) },
		],
	});

	interview.questions.push({
		question: result.text,
		answer: "",
		presentedAt: new Date(),
		clarifications: [],
	} as any);

	await interview.save();

	return { interview, question: result.text, timeExpired: false };
};

export const completeTechnicalInterview = async (interviewId: string): Promise<IInterview> => {
	const interview = await Interview.findById(interviewId).populate("questions.evaluation");
	if (!interview) throw new AppError("Interview not found", 404);

	const unanswered = interview.questions.some((q) => !q.answer);
	if (unanswered) {
		throw new AppError("Cannot complete technical interview — current question is unanswered", 400);
	}

	const exchanges = interview.questions.map((q) => {
		const evaluation = q.evaluation as any;
		return {
			question: q.question,
			answer: q.answer,
			score: evaluation?.score ?? 0,
			feedback: evaluation?.feedback ?? "",
		};
	});

	const summary = await generateTechnicalFinalSummary(exchanges);

	interview.overallScore = summary.overallScore;
	interview.overallFeedback = summary.feedback;
	interview.completedAt = new Date();
	await interview.save();

	return interview;
};


export const getTechnicalInterviewById = async (interviewId: string): Promise<IInterview> => {
  const interview = await Interview.findById(interviewId).populate('questions.evaluation');
  if (!interview) throw new AppError('Interview not found', 404);
  return interview;
};