"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { EASE_OUT_EXPO } from "@/lib/motion";

interface AnimatedMetricValueProps {
  value: string;
  durationMs?: number;
}

function parseMetricValue(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  const [, numericValue, suffix] = match;
  const decimals = numericValue.includes(".") ? numericValue.split(".")[1].length : 0;
  const normalizedSuffix = suffix.trim().toLowerCase();
  const multiplier =
    normalizedSuffix.startsWith("k") ? 1000 : normalizedSuffix.startsWith("m") ? 1_000_000 : 1;

  return {
    decimals,
    multiplier,
    suffix,
    target: Number.parseFloat(numericValue) * multiplier
  };
}

function easeOutExpo(value: number) {
  const [, controlOne, controlTwo, controlThree] = EASE_OUT_EXPO;

  return 1 - Math.pow(1 - value, 1 + controlOne + controlTwo + controlThree);
}

function formatAnimatedValue(
  numericValue: number,
  parsedValue: NonNullable<ReturnType<typeof parseMetricValue>>
) {
  const displayValue =
    parsedValue.multiplier > 1 ? numericValue / parsedValue.multiplier : numericValue;
  const rounded =
    parsedValue.decimals > 0
      ? displayValue.toFixed(parsedValue.decimals)
      : Math.round(displayValue).toString();

  return `${rounded}${parsedValue.suffix}`;
}

export function AnimatedMetricValue({
  durationMs = 1200,
  value
}: AnimatedMetricValueProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const parsedValue = useMemo(() => parseMetricValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(parsedValue ? "0" : value);

  useEffect(() => {
    if (!parsedValue) {
      setDisplayValue(value);
      return;
    }

    if (!isInView || prefersReducedMotion) {
      setDisplayValue(prefersReducedMotion ? value : "0");
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const nextValue = parsedValue.target * easeOutExpo(progress);

      setDisplayValue(formatAnimatedValue(nextValue, parsedValue));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [durationMs, isInView, parsedValue, prefersReducedMotion, value]);

  return <span ref={ref}>{displayValue}</span>;
}
