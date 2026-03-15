"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { countdownDigit } from "@/lib/motion";

interface QueuePositionProps {
  formattedPosition: string;
  formattedTotal: string;
}

export function QueuePosition({ formattedPosition, formattedTotal }: QueuePositionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="queue-position">
      <span className="queue-position__eyebrow">Your position</span>
      <div className="queue-position__value-wrap">
        {prefersReducedMotion ? (
          <span className="queue-position__value">{formattedPosition}</span>
        ) : (
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              className="queue-position__value"
              key={formattedPosition}
              variants={countdownDigit}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {formattedPosition}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="queue-position__total">of {formattedTotal} in queue</span>
    </div>
  );
}

