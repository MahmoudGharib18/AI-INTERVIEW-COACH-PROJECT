import { generateLinkedInDraft, getLinkedInDraftsForUser } from '#/modules/linkedin/linkedin.service.js';
import { catchAsync } from '#/shared/utils/catchAsync.js';
import { Request, Response } from 'express';

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