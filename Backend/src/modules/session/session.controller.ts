import { getActiveSessionForUser, getSessionForUser, getSessionHistoryForUser, startSession } from "#/modules/session/session.service.js";
import { catchAsync } from "#/shared/utils/catchAsync.js";
import { Request, Response } from "express";


export const openSession = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!._id.toString();
	const { sessionId } = req.params;

	const session = await startSession(sessionId, userId);

	res.status(200).json({ success: true, data: { session } });
});

export const getSession = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!._id.toString();
	const { sessionId } = req.params;

	const session = await getSessionForUser(sessionId, userId);

	res.status(200).json({ success: true, data: { session } });
});

export const getActiveSession = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!._id;

	const session = await getActiveSessionForUser(userId);

	if (!session) {
		res.status(200).json({ success: true, data: { session: null } });
		return;
	}

	res.status(200).json({ success: true, data: { session } });
});

export const getHistory = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!._id;

	const sessions = await getSessionHistoryForUser(userId);

	res.status(200).json({ success: true, data: { sessions } });
});
