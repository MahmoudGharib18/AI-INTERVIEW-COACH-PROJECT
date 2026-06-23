import { SESSION_STATES } from "#/config/constants.js";
import { ISession, Session } from "#/modules/session/session.model.js";
import { Types } from "mongoose";

export const createSession = async (userId: Types.ObjectId, scheduledTime: Date): Promise<ISession> => {
	return Session.create({
		user: userId,
		scheduledTime,
	});
};

export const findSessionById = async (sessionId: string): Promise<ISession | null> => {
	return Session.findById(sessionId);
};

export const findActiveSessionForUser = async (userId: Types.ObjectId): Promise<ISession | null> => {
	// "active" = today's session, not yet completed or missed
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	return Session.findOne({
		user: userId,
		scheduledTime: { $gte: startOfDay },
		isMissed: false,
	}).sort({ scheduledTime: -1 });
};

export const findSessionHistoryForUser = async (userId: Types.ObjectId, limit = 30): Promise<ISession[]> => {
	return Session.find({ user: userId }).sort({ scheduledTime: -1 }).limit(limit);
};

export const findPendingSessionsPastWindow = async (cutoffTime: Date): Promise<ISession[]> => {
	return Session.find({
		scheduledTime: { $lte: cutoffTime },
		status: { $in: [SESSION_STATES.PENDING, SESSION_STATES.EMAIL_SENT] },
		isMissed: false,
	});
};
