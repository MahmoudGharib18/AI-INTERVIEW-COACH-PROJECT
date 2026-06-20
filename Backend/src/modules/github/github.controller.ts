import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catchAsync';
import { submitGithubForSession, getGithubSubmissionsForUser } from './github.service';

export const submitGithub = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const submission = await submitGithubForSession(userId, req.body);

  res.status(201).json({ success: true, data: { submission } });
});

export const getGithubHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const submissions = await getGithubSubmissionsForUser(userId);

  res.status(200).json({ success: true, data: { submissions } });
});