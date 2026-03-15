"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ProgressBar } from "@/components/primitives/ProgressBar";
import { softPulse } from "@/lib/motion";

interface QueueProgressProps {
  batchInfo: string;
  currentQueueSize: string;
  estimatedWait: string;
  progress: number;
  statusMessage: string;
}

export function QueueProgress({
  batchInfo,
  currentQueueSize,
  estimatedWait,
  progress,
  statusMessage
}: QueueProgressProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="queue-progress">
      <ProgressBar
        className="queue-progress__bar"
        label={`${progress}% cleared`}
        value={progress}
        variant={progress >= 82 ? "flash" : "drop"}
      />

      <div className="queue-progress__meta">
        <span>{batchInfo}</span>
        <span>{estimatedWait}</span>
      </div>

      <div className="queue-progress__activity">
        <motion.span
          className="queue-progress__dot"
          animate={prefersReducedMotion ? undefined : "animate"}
          variants={softPulse}
        />
        <span>{statusMessage}</span>
      </div>

      <div className="queue-progress__queue-size">{currentQueueSize} still in the live queue</div>
    </div>
  );
}

