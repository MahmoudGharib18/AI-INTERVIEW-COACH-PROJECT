import { askDsaClarification, completeDsaInterview, getDsaInterviewById, startDsaInterview, submitDsaAnswer } from '#/modules/interview/dsa-interview.service.js';
import { Problem } from '#/modules/problem/problem.model.js';
import { AppError } from '#/shared/errors/AppError.js';
import { catchAsync } from '#/shared/utils/catchAsync.js';
import { Request, Response } from 'express';


export const startDsa = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  const { interview, problems } = await startDsaInterview(sessionId);

  res.status(201).json({
    success: true,
    data: {
      interview,
      problems, // includes full problem details for the frontend to render
    },
  });
});

export const submitDsa = catchAsync(async (req: Request, res: Response) => {
  const { interviewId } = req.params;
  const { questionIndex, problemId, code, language } = req.body;
  const userId = req.user!._id;

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError('Problem not found', 404);

  const interview = await submitDsaAnswer(
    interviewId,
    questionIndex,
    userId,
    problemId,
    problem,
    code,
    language
  );

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

  const problem = await Problem.findById(problemId);
  if (!problem) throw new AppError('Problem not found', 404);

  const result = await askDsaClarification(interviewId, questionIndex, problem, candidateQuestion);

  res.status(200).json({ success: true, data: result });
});

export const getDsa = catchAsync(async (req: Request, res: Response) => {
  const { interviewId } = req.params;

  const interview = await getDsaInterviewById(interviewId);

  res.status(200).json({ success: true, data: { interview } });
});