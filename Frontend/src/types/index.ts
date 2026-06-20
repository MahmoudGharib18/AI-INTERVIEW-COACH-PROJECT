export interface User {
  id: string;
  name: string;
  email: string;
  preferredInterviewTime: string;
}

export interface SessionState {
  id: string;
  status: 'PENDING' | 'EMAIL_SENT' | 'STARTED' | 'DSA_IN_PROGRESS' | 'TECHNICAL_IN_PROGRESS' | 'COMPLETED';
  scheduledTime: string;
  isLate: boolean;
  streakCount: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  constraints?: string;
}

export interface MetricOverview {
  streakCount: number;
  lateCount: number;
  missedCount: number;
  totalSessions: number;
  averageScore: number;
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