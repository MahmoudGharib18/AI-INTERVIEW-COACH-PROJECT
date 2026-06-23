import { beginDailySession, finishDsaAndStartTechnical, finishTechnicalAndCompleteSession } from '#/modules/session/daily-session.service.js';
import { catchAsync } from '#/shared/utils/catchAsync.js';
import { Request, Response } from 'express';


export const begin = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user!._id.toString();

  const result = await beginDailySession(sessionId, userId);

  res.status(200).json({ success: true, data: result });
});

export const advanceToTechnical = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const result = await finishDsaAndStartTechnical(sessionId);

  res.status(200).json({ success: true, data: result });
});

export const finish = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = await finishTechnicalAndCompleteSession(sessionId);

  res.status(200).json({ success: true, data: { session } });
});