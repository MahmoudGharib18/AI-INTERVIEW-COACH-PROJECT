export interface User {
  id: string;
  name: string;
  email: string;
  preferredInterviewTime: string;
}

export interface TrendPoint {
  date: string;
  score: number;
}

export interface WeaknessRecord {
  topic: string;
  riskFactor: 'HIGH' | 'MEDIUM' | 'LOW';
  count: number;
}

export interface ClarificationExchange {
  question: string;
  response: string;
  askedAt: string;
}

export interface QuestionAnswer {
  question: string;
  answer: string;
  presentedAt: string;
  clarifications: ClarificationExchange[];
}

export interface InterviewData {
  id: string;
  sessionId: string;
  type: 'dsa' | 'technical';
  questions: QuestionAnswer[];
  overallScore?: number;
  overallFeedback?: string;
  startedAt: string;
  completedAt?: string;
}