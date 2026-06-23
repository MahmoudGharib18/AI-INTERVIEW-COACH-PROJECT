import { useState, useEffect, useRef, useCallback } from 'react';

export const useCountdown = (durationSeconds: number, onExpire: () => void) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // resets whenever durationSeconds changes (i.e. a new problem/question starts)
  useEffect(() => {
    setSecondsLeft(durationSeconds);
    hasFiredRef.current = false;
  }, [durationSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (!hasFiredRef.current) {
            hasFiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const reset = useCallback((newDuration: number) => {
    setSecondsLeft(newDuration);
    hasFiredRef.current = false;
  }, []);

  return { secondsLeft, reset };
};