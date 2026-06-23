export const SYSTEM_CONFIG = {
	APP_NAME: "CORE//ORCHESTRATOR",
	VERSION: "V1.0.0-PROD",
	REFRESH_INTERVAL_MS: 1000,
	SWEEP_INTERVAL_MS: 15 * 60 * 1000,
};

// Per-difficulty DSA time limits, in seconds — must match backend's
// DSA_TIME_ALLOCATION_MINUTES in src/config/constants.ts exactly.
export const DSA_TIME_LIMITS_SECONDS = {
	EASY: 6 * 60,
	MEDIUM: 10 * 60,
	HARD: 14 * 60,
} as const;

export const TECHNICAL_TIME_LIMIT_SECONDS = 30 * 60;

export const APP_ROUTES = {
	LOGIN: "/login",
	REGISTER: "/register",
	DASHBOARD: "/dashboard",
	ARENA_GATEKEEPER: "/arena",
	ARENA_DSA: "/arena/dsa",
	ARENA_TECHNICAL: "/arena/technical",
	SYNC_LAUNCHPAD: "/sync-launchpad",
	SETTINGS: "/settings",
} as const;

// Mirrors the backend's actual state machine exactly:
// PENDING -> EMAIL_SENT -> STARTED -> DSA_IN_PROGRESS -> TECHNICAL_IN_PROGRESS -> COMPLETED
// isLate / isMissed are flags on the session, NOT states.
export const SESSION_STATES = {
	PENDING: "PENDING",
	EMAIL_SENT: "EMAIL_SENT",
	STARTED: "STARTED",
	DSA_IN_PROGRESS: "DSA_IN_PROGRESS",
	TECHNICAL_IN_PROGRESS: "TECHNICAL_IN_PROGRESS",
	COMPLETED: "COMPLETED",
} as const;

export const PROBLEM_DIFFICULTY = {
	EASY: "EASY",
	MEDIUM: "MEDIUM",
	HARD: "HARD",
} as const;

export type SessionState = (typeof SESSION_STATES)[keyof typeof SESSION_STATES];
export type ProblemDifficulty = (typeof PROBLEM_DIFFICULTY)[keyof typeof PROBLEM_DIFFICULTY];


