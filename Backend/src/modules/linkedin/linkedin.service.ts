import { Types } from 'mongoose';
import { getAIProvider } from '@/ai/ai.factory';
import { Session } from '@/modules/session/session.model';
import { LinkedInDraft, ILinkedInDraft } from './linkedin.model';
import { linkedInDraftSchema } from './linkedin.validation';
import {
  LINKEDIN_GENERATOR_SYSTEM_PROMPT,
  buildLinkedInPrompt,
} from '@/ai/prompts/linkedin-generator.prompt';
import { SESSION_STATES } from '@/config/constants';
import { AppError } from '@/shared/errors/AppError';

export const generateLinkedInDraft = async (
  sessionId: string,
  userId: Types.ObjectId
): Promise<ILinkedInDraft> => {
  const session = await Session.findById(sessionId);
  if (!session) throw new AppError('Session not found', 404);

  if (session.user.toString() !== userId.toString()) {
    throw new AppError('Not authorized to generate a post for this session', 403);
  }

  if (session.status !== SESSION_STATES.COMPLETED) {
    throw new AppError('Can only generate a LinkedIn draft for a completed session', 400);
  }

  if (!session.dsaSummary || !session.technicalSummary) {
    throw new AppError('Session is missing summary data', 400);
  }

  const provider = getAIProvider();

  const result = await provider.generateStructured({
    messages: [
      { role: 'system', content: LINKEDIN_GENERATOR_SYSTEM_PROMPT },
      {
        role: 'user',
        content: buildLinkedInPrompt({
          dsaScore: session.dsaSummary.score,
          dsaFeedback: session.dsaSummary.feedback,
          dsaStrengths: session.dsaSummary.strengths,
          dsaWeaknesses: session.dsaSummary.weaknesses,
          technicalScore: session.technicalSummary.score,
          technicalFeedback: session.technicalSummary.feedback,
          technicalStrengths: session.technicalSummary.strengths,
          technicalWeaknesses: session.technicalSummary.weaknesses,
        }),
      },
    ],
    schemaDescription: '{ postText: string, angle: string }',
    validate: (raw) => linkedInDraftSchema.parse(raw),
    temperature: 0.8, // higher than evaluation calls — this is creative writing, wants some variation
  });

  return LinkedInDraft.create({
    user: userId,
    session: session._id,
    postText: result.postText,
    angle: result.angle,
  });
};

export const getLinkedInDraftsForUser = async (
  userId: Types.ObjectId
): Promise<ILinkedInDraft[]> => {
  return LinkedInDraft.find({ user: userId }).sort({ createdAt: -1 });
};