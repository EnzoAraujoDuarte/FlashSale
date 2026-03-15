"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useRef } from "react";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/cn";
import { countdownDigit, urgencyPulse } from "@/lib/motion";
import { useEventStore } from "@/stores/useEventStore";

interface CountdownDisplayProps {
  targetDate: Date;
}

function formatValue(value: number) {
  return value.toString().padStart(2, "0");
}

interface CountdownUnitProps {
  label: string;
  value: number;
  urgent?: boolean;
}

function CountdownUnit({ label, urgent = false, value }: CountdownUnitProps) {
  const prefersReducedMotion = useReducedMotion();
  const formattedValue = formatValue(value);

  return (
    <div className={cn("countdown__item", urgent && "countdown__item--urgent")}>
      <div className="countdown__value-wrap">
        {prefersReducedMotion ? (
          <span className="countdown__value">{formattedValue}</span>
        ) : (
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              className="countdown__value"
              key={formattedValue}
              variants={countdownDigit}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {formattedValue}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="countdown__label">{label}</span>
    </div>
  );
}

function CountdownDisplayComponent({ targetDate }: CountdownDisplayProps) {
  const prefersReducedMotion = useReducedMotion();
  const countdown = useCountdown(targetDate);
  const advancePhase = useEventStore((state) => state.advancePhase);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (countdown.isExpired && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      advancePhase();
    }

    if (!countdown.isExpired) {
      hasTriggeredRef.current = false;
    }
  }, [advancePhase, countdown.isExpired]);

  return (
    <motion.div
      className={cn("countdown", countdown.isUrgent && "countdown--urgent")}
      animate={countdown.isUrgent && !prefersReducedMotion ? "animate" : undefined}
      variants={urgencyPulse}
    >
      <CountdownUnit label="Days" value={countdown.days} />
      <span className="countdown__separator" aria-hidden="true">
        :
      </span>
      <CountdownUnit label="Hrs" value={countdown.hours} />
      <span className="countdown__separator" aria-hidden="true">
        :
      </span>
      <CountdownUnit label="Min" value={countdown.minutes} />
      <span className="countdown__separator" aria-hidden="true">
        :
      </span>
      <CountdownUnit label="Sec" urgent={countdown.isUrgent} value={countdown.seconds} />
    </motion.div>
  );
}

export const CountdownDisplay = memo(CountdownDisplayComponent);

CountdownDisplay.displayName = "CountdownDisplay";

