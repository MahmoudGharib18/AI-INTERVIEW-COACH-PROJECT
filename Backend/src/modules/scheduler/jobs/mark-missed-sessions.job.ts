import { findPendingSessionsPastWindow } from "#/modules/session/session.repository.js";
import { markSessionAsMissed } from "#/modules/session/session.service.js";
import { getLateWindowMs } from "#/shared/utils/time.js";


/**
 * Runs every 15 minutes. Finds sessions whose 3-hour window has fully elapsed
 * and that were never started, then marks each as missed.
 * markSessionAsMissed is idempotent, so re-running this on overlapping
 * intervals is safe.
 */
export const runMarkMissedSessionsJob = async (): Promise<void> => {
  const cutoffTime = new Date(Date.now() - getLateWindowMs());

  const overdueSessions = await findPendingSessionsPastWindow(cutoffTime);

  if (overdueSessions.length === 0) return;

  for (const session of overdueSessions) {
    try {
      await markSessionAsMissed(session._id.toString());
      console.log(`⚠️  Session ${session._id} marked as missed`);
    } catch (error) {
      console.error(`❌ Failed to mark session ${session._id} as missed:`, error);
    }
  }
};