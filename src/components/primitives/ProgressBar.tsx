"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";

type ProgressBarVariant = "flash" | "drop" | "neutral" | "success";

interface ProgressBarProps {
  value: number;
  variant?: ProgressBarVariant;
  label?: string;
  className?: string;
}

export function ProgressBar({
  className,
  label,
  value,
  variant = "neutral"
}: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("progress-bar", className)}>
      <span className="progress-bar__track" aria-hidden="true">
        <motion.span
          className={cn("progress-bar__fill", `progress-bar__fill--${variant}`)}
          initial={false}
          animate={{ scaleX: clampedValue / 100 }}
          style={{ transformOrigin: "0% 50%" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
          }
        />
      </span>
      {label ? <span className="progress-bar__label">{label}</span> : null}
    </div>
  );
}
