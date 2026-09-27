import { useState, useEffect, useRef } from 'react';
import { formatCountdownSeconds } from '../utils/formatters';

export const useCountdown = (initialSeconds: number = 0) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initialSeconds]);

  const formatted = formatCountdownSeconds(secondsLeft);

  return {
    secondsLeft,
    isExpired: secondsLeft <= 0,
    formatted,
  };
};
