"use client";

import { motion, useReducedMotion } from "framer-motion";

import { softPulse } from "@/lib/motion";

interface LiveTickerProps {
  items: string[];
}

export function LiveTicker({ items }: LiveTickerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="live-ticker" aria-label="Event highlights">
      {items.map((item) => (
        <div className="live-ticker__item" key={item}>
          <motion.span
            className="live-ticker__dot"
            animate={prefersReducedMotion ? undefined : "animate"}
            variants={softPulse}
          />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

