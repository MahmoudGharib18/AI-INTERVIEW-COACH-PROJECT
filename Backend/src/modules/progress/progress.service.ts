import { SESSION_STATES } from '#/config/constants.js';
import { Session } from '#/modules/session/session.model.js';
import { User } from '#/modules/user/user.model.js';
import { AppError } from '#/shared/errors/AppError.js';
import { Types } from 'mongoose';


export interface ProgressOverview {
  streakCount: number;
  lateCount: number;
  missedCount: number;
  totalSessions: number;
  completionRate: number; // % of total sessions that were completed (not missed)
  averageScore: number | null; // null if no completed sessions yet
}

export interface ScoreTrendPoint {
  sessionId: string;
  date: Date;
  overallScore: number;
  dsaScore: number;
  technicalScore: number;
}

const WEAKNESS_TOPICS: { label: string; keywords: string[] }[] = [
  { label: 'Edge case handling', keywords: ['edge case', 'boundary', 'empty input', 'null', 'empty array'] },
  { label: 'Time complexity', keywords: ['time complexity', 'big-o', 'efficiency', 'slow', 'optimal'] },
  { label: 'Space complexity', keywords: ['space complexity', 'memory'] },
  { label: 'Recursion', keywords: ['recursion', 'recursive', 'base case'] },
  { label: 'Dynamic programming', keywords: ['dynamic programming', 'memoization', 'dp'] },
  { label: 'Code readability', keywords: ['readability', 'naming', 'variable names', 'clarity'] },
  { label: 'Problem understanding', keywords: ['misunderstood', 'understanding', 'requirements'] },
  { label: 'System design', keywords: ['system design', 'scalability', 'architecture'] },
  { label: 'Database/data modeling', keywords: ['database', 'schema', 'query', 'indexing'] },
  { label: 'API design', keywords: ['api design', 'rest', 'endpoint'] },
  { label: 'Authentication/security', keywords: ['authentication', 'security', 'jwt', 'token'] },
  { label: 'Testing', keywords: ['testing', 'test case', 'unit test'] },
  { label: 'Communication/clarity', keywords: ['unclear', 'vague', 'explanation', 'communicate'] },
];

export interface WeaknessFrequency {
  topic: string;
  count: number;
}

export const getWeaknessFrequency = async (
  userId: Types.ObjectId,
  limit = 30
): Promise<WeaknessFrequency[]> => {
  const sessions = await Session.find({
    user: userId,
    status: SESSION_STATES.COMPLETED,
  })
    .sort({ completedTime: -1 })
    .limit(limit)
    .select('dsaSummary technicalSummary');

  const allWeaknesses: string[] = sessions.flatMap((s) => [
    ...(s.dsaSummary?.weaknesses ?? []),
    ...(s.technicalSummary?.weaknesses ?? []),
  ]);

  const topicCounts = new Map<string, number>();

  for (const weaknessText of allWeaknesses) {
    const lower = weaknessText.toLowerCase();

    for (const topic of WEAKNESS_TOPICS) {
      const matched = topic.keywords.some((kw) => lower.includes(kw));
      if (matched) {
        topicCounts.set(topic.label, (topicCounts.get(topic.label) ?? 0) + 1);
      }
    }
  }

  return Array.from(topicCounts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

export const getScoreTrend = async (
  userId: Types.ObjectId,
  limit = 30
): Promise<ScoreTrendPoint[]> => {
  const sessions = await Session.find({
    user: userId,
    status: SESSION_STATES.COMPLETED,
  })
    .sort({ completedTime: 1 }) // chronological, oldest first — correct order for a trend line
    .limit(limit)
    .select('completedTime overallScore dsaSummary technicalSummary');

  return sessions.map((s) => ({
    sessionId: s._id.toString(),
    date: s.completedTime as Date,
    overallScore: s.overallScore ?? 0,
    dsaScore: s.dsaSummary?.score ?? 0,
    technicalScore: s.technicalSummary?.score ?? 0,
  }));
};

export const getProgressOverview = async (userId: Types.ObjectId): Promise<ProgressOverview> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const completedSessions = await Session.find({
    user: userId,
    status: SESSION_STATES.COMPLETED,
  }).select('overallScore');

  const averageScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) /
            completedSessions.length
        )
      : null;

  const completionRate =
    user.totalSessions > 0
      ? Math.round((completedSessions.length / user.totalSessions) * 100)
      : 0;

  return {
    streakCount: user.streakCount,
    lateCount: user.lateCount,
    missedCount: user.missedCount,
    totalSessions: user.totalSessions,
    completionRate,
    averageScore,
  };
};