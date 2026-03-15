"use client";

import { useEffect, useMemo, useState } from "react";

import { useCartStore } from "@/stores/useCartStore";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatTime(secondsRemaining: number) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return `${pad(minutes)}:${pad(seconds)}`;
}

export function useCartExpiry() {
  const expiresAt = useCartStore((state) => state.expiresAt);
  const reservationDuration = useCartStore((state) => state.reservationDuration);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    setNow(Date.now());

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [expiresAt]);

  return useMemo(() => {
    if (!expiresAt) {
      return {
        expiresAt: null,
        secondsRemaining: 0,
        isExpired: false,
        isUrgent: false,
        isCritical: false,
        formattedTime: "00:00",
        progress: 0
      };
    }

    const remainingMs = expiresAt.getTime() - now;
    const secondsRemaining = Math.max(0, Math.ceil(remainingMs / 1000));
    const timeSpent = Math.max(0, reservationDuration - remainingMs);
    const progress =
      reservationDuration > 0
        ? Math.max(0, Math.min(100, Math.round((timeSpent / reservationDuration) * 100)))
        : 0;

    return {
      expiresAt,
      secondsRemaining,
      isExpired: remainingMs <= 0,
      isUrgent: secondsRemaining > 0 && secondsRemaining < 120,
      isCritical: secondsRemaining > 0 && secondsRemaining < 60,
      formattedTime: formatTime(secondsRemaining),
      progress
    };
  }, [expiresAt, now, reservationDuration]);
}
