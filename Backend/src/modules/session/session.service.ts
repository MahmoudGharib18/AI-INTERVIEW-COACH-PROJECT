import { Types } from "mongoose";
import { ISession } from "./session.model";
import { User } from "@/modules/user/user.model";
import { createSession, findSessionById, findActiveSessionForUser, findSessionHistoryForUser } from "./session.repository";
import { assertTransition } from "./session.state-machine";
import { SESSION_STATES, SessionState } from "@/config/constants";
import { AppError } from "@/shared/errors/AppError";
import { isWithinLateWindow } from "@/shared/utils/time";

export const scheduleSessionForUser = async (userId: Types.ObjectId, scheduledTime: Date): Promise<ISession> => {
	return createSession(userId, scheduledTime);
};

export const markEmailSent = async (sessionId: string): Promise<ISession> => {
	const session = await findSessionById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	assertTransition(session.status as SessionState, SESSION_STATES.EMAIL_SENT);

	session.status = SESSION_STATES.EMAIL_SENT;
	await session.save();
	return session;
};

export const startSession = async (sessionId: string, userId: string): Promise<ISession> => {
	const session = await findSessionById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	if (session.user.toString() !== userId) {
		throw new AppError("Not authorized to access this session", 403);
	}

	if (session.isMissed) {
		throw new AppError("This session has already been marked as missed", 400);
	}

	assertTransition(session.status as SessionState, SESSION_STATES.STARTED);

	const openedLate = !isWithinLateWindow(session.scheduledTime);

	if (openedLate) {
		session.isLate = true;
		// increment lateCount immediately on open, not at completion —
		// lateness is determined by when they opened it, so record it now
		await User.findByIdAndUpdate(userId, { $inc: { lateCount: 1 } });
	}

	session.status = SESSION_STATES.STARTED;
	session.startedTime = new Date();
	await session.save();
	return session;
};

export const advanceToDsaInProgress = async (sessionId: string): Promise<ISession> => {
	const session = await findSessionById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	assertTransition(session.status as SessionState, SESSION_STATES.DSA_IN_PROGRESS);

	session.status = SESSION_STATES.DSA_IN_PROGRESS;
	await session.save();
	return session;
};

export const advanceToTechnicalInProgress = async (sessionId: string): Promise<ISession> => {
	const session = await findSessionById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	assertTransition(session.status as SessionState, SESSION_STATES.TECHNICAL_IN_PROGRESS);

	session.status = SESSION_STATES.TECHNICAL_IN_PROGRESS;
	await session.save();
	return session;
};

export const completeSession = async (
  sessionId: string,
  result: {
    overallScore: number;
    summary: string;
    improvementSuggestions: string[];
    dsaSummary: ISession['dsaSummary'];
    technicalSummary: ISession['technicalSummary'];
  }
): Promise<ISession> => {
  const session = await findSessionById(sessionId);
  if (!session) throw new AppError('Session not found', 404);

  assertTransition(session.status as SessionState, SESSION_STATES.COMPLETED);

  session.status = SESSION_STATES.COMPLETED;
  session.completedTime = new Date();
  session.overallScore = result.overallScore;
  session.summary = result.summary;
  session.improvementSuggestions = result.improvementSuggestions;
  session.dsaSummary = result.dsaSummary;
  session.technicalSummary = result.technicalSummary;
  await session.save();

  // streak only increments on completion — a late-but-completed session
  // still grows the streak; only a missed session breaks it
  await User.findByIdAndUpdate(session.user, {
    $inc: { streakCount: 1, totalSessions: 1 },
  });

  return session;
};

export const getSessionForUser = async (sessionId: string, userId: string): Promise<ISession> => {
	const session = await findSessionById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	if (session.user.toString() !== userId) {
		throw new AppError("Not authorized to access this session", 403);
	}

	return session;
};

export const getActiveSessionForUser = async (userId: Types.ObjectId): Promise<ISession | null> => {
	return findActiveSessionForUser(userId);
};

export const getSessionHistoryForUser = async (userId: Types.ObjectId): Promise<ISession[]> => {
	return findSessionHistoryForUser(userId);
};

export const markSessionAsMissed = async (sessionId: string): Promise<ISession> => {
  const session = await findSessionById(sessionId);
  if (!session) throw new AppError('Session not found', 404);

  if (session.isMissed || session.status === SESSION_STATES.COMPLETED) {
    return session; // already resolved, nothing to do — safe to call repeatedly
  }

  session.isMissed = true;
  await session.save();

  // missed session breaks the streak and counts against the user
  await User.findByIdAndUpdate(session.user, {
    $inc: { missedCount: 1, totalSessions: 1 },
    $set: { streakCount: 0 },
  });

  return session;
};

export const markEmailFailed = async (sessionId: string): Promise<ISession> => {
  const session = await findSessionById(sessionId);
  if (!session) throw new AppError('Session not found', 404);

  session.emailFailed = true;
  await session.save();
  return session;
};