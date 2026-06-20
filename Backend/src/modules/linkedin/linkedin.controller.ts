import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catchAsync';
import { generateLinkedInDraft, getLinkedInDraftsForUser } from './linkedin.service';

export const createDraft = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { sessionId } = req.body;

  const draft = await generateLinkedInDraft(sessionId, userId);

  res.status(201).json({ success: true, data: { draft } });
});

export const getDrafts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const drafts = await getLinkedInDraftsForUser(userId);

  res.status(200).json({ success: true, data: { drafts } });
});