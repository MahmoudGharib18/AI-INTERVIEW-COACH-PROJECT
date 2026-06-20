export const SESSION_STATES = {
  PENDING: 'PENDING',
  EMAIL_SENT: 'EMAIL_SENT',
  STARTED: 'STARTED',
  DSA_IN_PROGRESS: 'DSA_IN_PROGRESS',
  TECHNICAL_IN_PROGRESS: 'TECHNICAL_IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type SessionState = (typeof SESSION_STATES)[keyof typeof SESSION_STATES];

export const PROBLEM_DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export type ProblemDifficulty = (typeof PROBLEM_DIFFICULTY)[keyof typeof PROBLEM_DIFFICULTY];

// minutes allotted per difficulty within the 30-min DSA block
export const DSA_TIME_ALLOCATION_MINUTES = {
  EASY: 6,
  MEDIUM: 10,
  HARD: 14,
} as const;

export const INTERVIEW_TYPES = {
  DSA: 'DSA',
  TECHNICAL: 'TECHNICAL',
} as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[keyof typeof INTERVIEW_TYPES];

export const SUBMISSION_SOURCES = {
  DAILY_SESSION: 'DAILY_SESSION',
  PRACTICE_MODE: 'PRACTICE_MODE',
  MOCK_INTERVIEW: 'MOCK_INTERVIEW',
} as const;

export type SubmissionSource = (typeof SUBMISSION_SOURCES)[keyof typeof SUBMISSION_SOURCES];

export const DSA_TIME_LIMIT_MS = {
  EASY: DSA_TIME_ALLOCATION_MINUTES.EASY * 60 * 1000,
  MEDIUM: DSA_TIME_ALLOCATION_MINUTES.MEDIUM * 60 * 1000,
  HARD: DSA_TIME_ALLOCATION_MINUTES.HARD * 60 * 1000,
} as const;