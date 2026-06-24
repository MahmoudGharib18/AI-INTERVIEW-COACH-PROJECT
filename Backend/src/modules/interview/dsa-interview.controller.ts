import { askDsaClarification, completeDsaInterview, getDsaInterviewById, startDsaInterview, submitDsaAnswer } from "#/modules/interview/dsa-interview.service.js";
import { Interview } from "#/modules/interview/interview.model.js";
import { IProblem, Problem } from "#/modules/problem/problem.model.js";
import { AppError } from "#/shared/errors/AppError.js";
import { catchAsync } from "#/shared/utils/catchAsync.js";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

async function resolveProblem(interviewId: string, questionIndex: number, problemId: string): Promise<IProblem> {
	if (isValidObjectId(problemId)) {
		const problem = await Problem.findById(problemId);
		if (problem) return problem;
	}

	const interview = await Interview.findById(interviewId);
	if (!interview) throw new AppError("Interview not found", 404);

	const questionEntry = interview.questions[questionIndex];
	if (!questionEntry) throw new AppError("Invalid question index", 400);

	return {
		_id: null,
		title: `Problem ${questionIndex + 1}`,
		description: questionEntry.question,
		difficulty: questionEntry.difficulty || "MEDIUM",
		constraints: [],
		examples: [],
		tags: [],
	} as any;
}

export const startDsa = catchAsync(async (req: Request, res: Response) => {
	const { sessionId } = req.body;

	const { interview, problems } = await startDsaInterview(sessionId);

	res.status(201).json({
		success: true,
		data: {
			interview,
			problems,
		},
	});
});

export const submitDsa = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;
	const { questionIndex, problemId, code, language } = req.body;
	const userId = req.user!._id;

	const problem = await resolveProblem(interviewId, questionIndex, problemId);
	const problemSnapshot = problem._id ? undefined : `Problem ${questionIndex + 1} (${problem.difficulty})`;

	const interview = await submitDsaAnswer(interviewId, questionIndex, userId, problem._id, problem, code, language, problemSnapshot);

	res.status(200).json({ success: true, data: { interview } });
});

export const completeDsa = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;

	const interview = await completeDsaInterview(interviewId);

	res.status(200).json({ success: true, data: { interview } });
});

export const askClarification = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;
	const { questionIndex, problemId, candidateQuestion } = req.body;

	const problem = await resolveProblem(interviewId, questionIndex, problemId);

	const result = await askDsaClarification(interviewId, questionIndex, problem, candidateQuestion);

	res.status(200).json({ success: true, data: result });
});

export const getDsa = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;

	const interview = await getDsaInterviewById(interviewId);

	res.status(200).json({ success: true, data: { interview } });
});
