import { SESSION_STATES, SessionState } from "#/config/constants.js";
import { AppError } from "#/shared/errors/AppError.js";

// defines the only legal forward transitions
const ALLOWED_TRANSITIONS: Record<SessionState, SessionState[]> = {
  [SESSION_STATES.PENDING]: [SESSION_STATES.EMAIL_SENT],
  [SESSION_STATES.EMAIL_SENT]: [SESSION_STATES.STARTED],
  [SESSION_STATES.STARTED]: [SESSION_STATES.DSA_IN_PROGRESS],
  [SESSION_STATES.DSA_IN_PROGRESS]: [SESSION_STATES.TECHNICAL_IN_PROGRESS],
  [SESSION_STATES.TECHNICAL_IN_PROGRESS]: [SESSION_STATES.COMPLETED],
  [SESSION_STATES.COMPLETED]: [], // terminal state, no transitions out
};

export const canTransition = (
  from: SessionState,
  to: SessionState
): boolean => {
  return ALLOWED_TRANSITIONS[from].includes(to);
};

export const assertTransition = (
  from: SessionState,
  to: SessionState
): void => {
  if (!canTransition(from, to)) {
    throw new AppError(
      `Invalid session state transition: cannot move from ${from} to ${to}`,
      400
    );
  }
};

export const isTerminalState = (state: SessionState): boolean => {
  return state === SESSION_STATES.COMPLETED;
};