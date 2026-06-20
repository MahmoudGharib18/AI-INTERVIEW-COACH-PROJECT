import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catchAsync';
import {
  startTechnicalInterview,
  submitTechnicalAnswer,
  getNextTechnicalQuestion,
  completeTechnicalInterview,
} from './technical-interview.service';

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

  const { interview, question } = await getNextTechnicalQuestion(interviewId);

  res.status(200).json({ success: true, data: { interview, question } });
});

export const completeTechnical = catchAsync(async (req: Request, res: Response) => {
  const { interviewId } = req.params;

  const interview = await completeTechnicalInterview(interviewId);

  res.status(200).json({ success: true, data: { interview } });
});