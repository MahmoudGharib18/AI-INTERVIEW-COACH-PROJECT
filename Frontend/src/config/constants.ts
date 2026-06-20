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

export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ARENA_GATEKEEPER: '/arena/gatekeeper',
  ARENA_DSA: '/arena/dsa',
  ARENA_TECHNICAL: '/arena/technical',
  SYNC_LAUNCHPAD: '/workspace/sync',
};