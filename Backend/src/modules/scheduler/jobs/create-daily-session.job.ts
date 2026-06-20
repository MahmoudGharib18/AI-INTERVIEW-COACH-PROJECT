import { User } from '@/modules/user/user.model';
import { scheduleSessionForUser } from '@/modules/session/session.service';
import { enqueueSessionReminderEmail } from '@/modules/scheduler/email.queue';

export const runCreateDailySessionJob = async (): Promise<void> => {
  const now = new Date();
  const currentTime = formatAsHHmm(now);

  const usersDueNow = await User.find({ preferredInterviewTime: currentTime });

  if (usersDueNow.length === 0) return;

  for (const user of usersDueNow) {
    try {
      const session = await scheduleSessionForUser(user._id as any, now);

      await enqueueSessionReminderEmail({
        toEmail: user.email,
        userName: user.name,
        sessionId: session._id.toString(),
      });

      console.log(`✅ Daily session created, email queued for ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed to create daily session for ${user.email}:`, error);
    }
  }
};

function formatAsHHmm(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}