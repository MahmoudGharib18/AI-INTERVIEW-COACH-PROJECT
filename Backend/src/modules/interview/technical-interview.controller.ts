import { completeTechnicalInterview, getNextTechnicalQuestion, getTechnicalInterviewById, startTechnicalInterview, submitTechnicalAnswer } from "#/modules/interview/technical-interview.service.js";
import { catchAsync } from "#/shared/utils/catchAsync.js";
import { Request, Response } from "express";


export const startTechnical = catchAsync(async (req: Request, res: Response) => {
	const { sessionId } = req.body;

	const interview = await startTechnicalInterview(sessionId);

	res.status(201).json({ success: true, data: { interview } });
});

export const submitTechnical = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;
	const { answer } = req.body;

	const { interview, evaluation } = await submitTechnicalAnswer(interviewId, answer);

	res.status(200).json({ success: true, data: { interview, evaluation } });
});

export const getNextQuestion = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;

	const { interview, question, timeExpired } = await getNextTechnicalQuestion(interviewId);

	res.status(200).json({ success: true, data: { interview, question, timeExpired } });
});

export const completeTechnical = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;

	const interview = await completeTechnicalInterview(interviewId);

	res.status(200).json({ success: true, data: { interview } });
});

export const getTechnical = catchAsync(async (req: Request, res: Response) => {
	const { interviewId } = req.params;

	const interview = await getTechnicalInterviewById(interviewId);

	res.status(200).json({ success: true, data: { interview } });
});
