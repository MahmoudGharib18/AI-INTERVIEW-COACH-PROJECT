export interface User {
  id: string;
  name: string;
  email: string;
  preferredInterviewTime: string;
}

export interface InterviewSummary {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}

export type SessionStatus =
  | 'PENDING'
  | 'EMAIL_SENT'
  | 'STARTED'
  | 'DSA_IN_PROGRESS'
  | 'TECHNICAL_IN_PROGRESS'
  | 'COMPLETED';

export interface Session {
  _id: string;
  user: string;
  scheduledTime: string;
  startedTime?: string;
  completedTime?: string;
  status: SessionStatus;
  dsaInterview?: string;
  technicalInterview?: string;
  dsaSummary?: InterviewSummary;
  technicalSummary?: InterviewSummary;
  overallScore?: number;
  summary?: string;
  improvementSuggestions: string[];
  isLate: boolean;
  isMissed: boolean;
  emailFailed: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  constraints: string[];
  examples: ProblemExample[];
  tags: string[];
}

export interface ClarificationExchange {
  question: string;
  response: string;
  wasFlagged: boolean;
  usedFallback: boolean;
  askedAt: string;
}

export interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  correctness?: boolean;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  evaluation?: EvaluationResult;
  presentedAt: string;
  clarifications: ClarificationExchange[];
}

export interface Interview {
  _id: string;
  session: string;
  type: 'DSA' | 'TECHNICAL';
  questions: QuestionAnswer[];
  overallScore?: number;
  overallFeedback?: string;
  startedAt: string;
  completedAt?: string;
}

export interface TrendPoint {
  sessionId: string;
  date: string;
  overallScore: number;
  dsaScore: number;
  technicalScore: number;
}

export interface ProgressOverview {
  streakCount: number;
  lateCount: number;
  missedCount: number;
  totalSessions: number;
  completionRate: number;
  averageScore: number | null;
}

export interface WeaknessFrequency {
  topic: string;
  count: number;
}

export interface GithubSubmission {
  _id: string;
  user: string;
  session: string;
  repositoryUrl: string;
  commitUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface LinkedInDraft {
  _id: string;
  user: string;
  session: string;
  postText: string;
  angle: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}