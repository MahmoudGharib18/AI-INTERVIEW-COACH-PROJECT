import { env } from '@/config/env';

const HOUR_MS = 60 * 60 * 1000;

export const getLateWindowMs = (): number => {
  return env.SESSION_LATE_WINDOW_HOURS * HOUR_MS;
};

export const isWithinLateWindow = (scheduledTime: Date, now: Date = new Date()): boolean => {
  const windowEnd = new Date(scheduledTime.getTime() + getLateWindowMs());
  return now <= windowEnd;
};

export const hasExceededLateWindow = (scheduledTime: Date, now: Date = new Date()): boolean => {
  return !isWithinLateWindow(scheduledTime, now);
};