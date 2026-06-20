export const SYSTEM_CONFIG = {
  APP_NAME: 'CORE//ORCHESTRATOR',
  VERSION: 'V1.0.0-PROD',
  REFRESH_INTERVAL_MS: 1000,
  SWEEP_INTERVAL_MS: 15 * 60 * 1000,
};

export const INTERVIEW_TIMERS = {
  EASY: 6 * 60,      // 6 minutes
  MEDIUM: 10 * 60,   // 10 minutes
  HARD: 14 * 60,     // 14 minutes
  TECHNICAL: 30 * 60 // 30 minutes
};

// Core Application Path Matrix Links
export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ARENA_GATEKEEPER: '/arena',
  ARENA_DSA: '/arena/dsa',
  ARENA_TECHNICAL: '/arena/technical',
  SYNC_LAUNCHPAD: '/sync-launchpad'
} as const;

// Session States reflecting session.model.ts parameters
export const SESSION_STATES = {
  PENDING: 'PENDING',
  DSA_IN_PROGRESS: 'DSA_IN_PROGRESS',
  TECHNICAL_IN_PROGRESS: 'TECHNICAL_IN_PROGRESS',
  EVALUATING: 'EVALUATING',
  COMPLETED: 'COMPLETED',
  MISSED: 'MISSED'
} as const;

// Difficulty limits matching problem.model.ts
export const PROBLEM_DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
} as const;

// Time thresholds per session scale (in minutes)
export const TIMING_CONSTRAINTS = {
  EASY_LIMIT: 6,
  MEDIUM_LIMIT: 10,
  HARD_LIMIT: 14
} as const;

export type SessionState = typeof SESSION_STATES[keyof typeof SESSION_STATES];
export type ProblemDifficulty = typeof PROBLEM_DIFFICULTY[keyof typeof PROBLEM_DIFFICULTY];