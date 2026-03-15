"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  progress: number;
  isExpired: boolean;
  isUrgent: boolean;
}

function buildCountdownState(targetMs: number, initialTotalSeconds: number): CountdownResult {
  const diff = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.max(0, Math.ceil(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const progress =
    initialTotalSeconds <= 0
      ? 100
      : Math.min(
          100,
          Math.max(0, Math.round((1 - totalSeconds / initialTotalSeconds) * 100))
        );

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    progress,
    isExpired: totalSeconds <= 0,
    isUrgent: totalSeconds <= 60
  };
}

export function useCountdown(targetDate: Date) {
  const targetMs = targetDate.getTime();
  const initialTotalSecondsRef = useRef(
    Math.max(1, Math.ceil((targetMs - Date.now()) / 1000))
  );
  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    buildCountdownState(targetMs, initialTotalSecondsRef.current)
  );

  const updateCountdown = useCallback(() => {
    setCountdown(buildCountdownState(targetMs, initialTotalSecondsRef.current));
  }, [targetMs]);

  useEffect(() => {
    initialTotalSecondsRef.current = Math.max(1, Math.ceil((targetMs - Date.now()) / 1000));
    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetMs, updateCountdown]);

  return countdown;
}

