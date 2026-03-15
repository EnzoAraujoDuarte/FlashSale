"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/cn";

interface CountdownCompactProps {
  targetDate: Date;
  className?: string;
  label?: string;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatTime(totalSeconds: number) {
  if (totalSeconds <= 0) {
    return "00:00";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

export function CountdownCompact({
  className,
  label = "Ends in",
  targetDate
}: CountdownCompactProps) {
  const countdown = useCountdown(targetDate);

  return (
    <div
      className={cn(
        "countdown-compact",
        countdown.totalSeconds <= 300 && "countdown-compact--warning",
        countdown.totalSeconds <= 60 && "countdown-compact--urgent",
        className
      )}
    >
      <span className="countdown-compact__icon" aria-hidden="true">
        T
      </span>
      <span className="countdown-compact__label">{label}</span>
      <span className="countdown-compact__value">{formatTime(countdown.totalSeconds)}</span>
    </div>
  );
}
