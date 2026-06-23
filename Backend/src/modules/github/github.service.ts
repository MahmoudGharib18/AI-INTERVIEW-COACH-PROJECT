import { SESSION_STATES } from '#/config/constants.js';
import { GithubSubmission, IGithubSubmission } from '#/modules/github/github.model.js';
import { SubmitGithubInput } from '#/modules/github/github.validation.js';
import { Session } from '#/modules/session/session.model.js';
import { AppError } from '#/shared/errors/AppError.js';
import { Types } from 'mongoose';


export const submitGithubForSession = async (
  userId: Types.ObjectId,
  input: SubmitGithubInput
): Promise<IGithubSubmission> => {
  const session = await Session.findById(input.sessionId);
  if (!session) throw new AppError('Session not found', 404);

  if (session.user.toString() !== userId.toString()) {
    throw new AppError('Not authorized to submit GitHub info for this session', 403);
  }

  if (session.status !== SESSION_STATES.COMPLETED) {
    throw new AppError('Can only submit GitHub info for a completed session', 400);
  }

  return GithubSubmission.create({
    user: userId,
    session: session._id,
    repositoryUrl: input.repositoryUrl,
    commitUrl: input.commitUrl,
    notes: input.notes,
  });
};

export const getGithubSubmissionsForUser = async (
  userId: Types.ObjectId
): Promise<IGithubSubmission[]> => {
  return GithubSubmission.find({ user: userId }).sort({ createdAt: -1 });
};