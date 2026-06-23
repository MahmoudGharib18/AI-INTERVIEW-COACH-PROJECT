import { completeDsaInterview } from '#/modules/interview/dsa-interview.service.js';
import { startDsaInterview } from "#/modules/interview/dsa-interview.service.js";
import { completeTechnicalInterview, startTechnicalInterview } from "#/modules/interview/technical-interview.service.js";
import { ISession, Session } from "#/modules/session/session.model.js";
import { startSession as startSessionLifecycle, advanceToDsaInProgress, advanceToTechnicalInProgress, completeSession } from "#/modules/session/session.service.js";
import { AppError } from "#/shared/errors/AppError.js";
import { Types } from "mongoose";



/**
 * Step 1 of the daily flow: user opens the session within (or after) the late window.
 * Flips session to STARTED, then immediately kicks off the DSA interview
 * and links it to the session.
 */
export const beginDailySession = async (sessionId: string, userId: string): Promise<{ session: ISession; dsaInterviewId: string; problems: any[] }> => {
	const session = await startSessionLifecycle(sessionId, userId);

	const { interview: dsaInterview, problems } = await startDsaInterview(session._id as Types.ObjectId);

	await advanceToDsaInProgress(sessionId);

	session.dsaInterview = dsaInterview._id as Types.ObjectId;
	await session.save();

	return {
		session,
		dsaInterviewId: dsaInterview._id.toString(),
		problems,
	};
};

/**
 * Step 2: DSA portion is done (all 3 problems submitted). Roll up DSA scoring,
 * snapshot it onto the session, advance session state, and start Technical.
 */
export const finishDsaAndStartTechnical = async (sessionId: string): Promise<{ session: ISession; technicalInterviewId: string; firstQuestion: string }> => {
	const session = await Session.findById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	if (!session.dsaInterview) {
		throw new AppError("No DSA interview linked to this session", 400);
	}

	const completedDsa = await completeDsaInterview(session.dsaInterview.toString());

	// snapshot DSA summary onto the session now, while we have it —
	// don't wait until full session completion to record this
	session.dsaSummary = {
		score: completedDsa.overallScore ?? 0,
		feedback: completedDsa.overallFeedback ?? "",
		strengths: extractAllStrengths(completedDsa),
		weaknesses: extractAllWeaknesses(completedDsa),
	};
	await session.save();

	await advanceToTechnicalInProgress(sessionId);

	const technicalInterview = await startTechnicalInterview(session._id as Types.ObjectId);

	session.technicalInterview = technicalInterview._id as Types.ObjectId;
	await session.save();

	const firstQuestion = technicalInterview.questions[0].question;

	return {
		session,
		technicalInterviewId: technicalInterview._id.toString(),
		firstQuestion,
	};
};

/**
 * Step 3: Technical portion is done. Roll up Technical scoring, combine with
 * the already-snapshotted DSA summary to compute the final overall result,
 * and complete the session.
 */
export const finishTechnicalAndCompleteSession = async (sessionId: string): Promise<ISession> => {
	const session = await Session.findById(sessionId);
	if (!session) throw new AppError("Session not found", 404);

	if (!session.technicalInterview) {
		throw new AppError("No technical interview linked to this session", 400);
	}

	if (!session.dsaSummary) {
		throw new AppError("DSA portion must be completed before completing the session", 400);
	}

	const completedTechnical = await completeTechnicalInterview(session.technicalInterview.toString());

	const technicalSummary = {
		score: completedTechnical.overallScore ?? 0,
		feedback: completedTechnical.overallFeedback ?? "",
		strengths: extractAllStrengths(completedTechnical),
		weaknesses: extractAllWeaknesses(completedTechnical),
	};

	const overallScore = Math.round((session.dsaSummary.score + technicalSummary.score) / 2);

	const improvementSuggestions = [...session.dsaSummary.weaknesses, ...technicalSummary.weaknesses].slice(0, 5); // cap it — don't dump every weakness verbatim as "improvement suggestions"

	const combinedSummary = `DSA: ${session.dsaSummary.feedback} Technical: ${technicalSummary.feedback}`;

	const completedSession = await completeSession(sessionId, {
		overallScore,
		summary: combinedSummary,
		improvementSuggestions,
		dsaSummary: session.dsaSummary,
		technicalSummary,
	});

	return completedSession;
};

// --- helpers ---

function extractAllStrengths(interview: any): string[] {
	return interview.questions.map((q: any) => q.evaluation?.strengths ?? []).flat();
}

function extractAllWeaknesses(interview: any): string[] {
	return interview.questions.map((q: any) => q.evaluation?.weaknesses ?? []).flat();
}
