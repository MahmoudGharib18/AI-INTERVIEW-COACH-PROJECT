import { getProgressOverview, getScoreTrend, getWeaknessFrequency } from '#/modules/progress/progress.service.js';
import { catchAsync } from '#/shared/utils/catchAsync.js';
import { Request, Response } from 'express';


export const getOverview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const overview = await getProgressOverview(userId);

  res.status(200).json({ success: true, data: { overview } });
});

export const getTrend = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const limit = req.query.limit ? Number(req.query.limit) : 30;

  const trend = await getScoreTrend(userId, limit);

  res.status(200).json({ success: true, data: { trend } });
});

// add to progress.controller.ts
export const getWeaknesses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const limit = req.query.limit ? Number(req.query.limit) : 30;

  const weaknesses = await getWeaknessFrequency(userId, limit);

  res.status(200).json({ success: true, data: { weaknesses } });
});