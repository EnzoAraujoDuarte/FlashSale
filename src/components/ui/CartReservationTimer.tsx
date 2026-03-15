"use client";

import { motion } from "framer-motion";

import { ProgressBar } from "@/components/primitives/ProgressBar";
import { Body, Label } from "@/components/primitives/Typography";
import { useCartExpiry } from "@/hooks/useCartExpiry";
import { softPulse } from "@/lib/motion";

export function CartReservationTimer() {
  const { formattedTime, isCritical, isUrgent, progress } = useCartExpiry();
  const variant = isCritical ? "critical" : isUrgent ? "urgent" : "default";
  const title = isCritical
    ? "Expires in"
    : isUrgent
      ? `Hurry! Expires in ${formattedTime}`
      : "Items reserved for";
  const support = isCritical
    ? "Final minute. Reserved inventory is about to be released."
    : isUrgent
      ? "Move now before the reserved hold disappears."
      : "Your reserved inventory is protected while the timer is active.";

  return (
    <motion.div
      className={`cart-reservation cart-reservation--${variant}`}
      animate={isCritical ? "animate" : undefined}
      variants={softPulse}
    >
      <div className="cart-reservation__top">
        <div className="cart-reservation__copy">
          <Label>{title}</Label>
          <Body className="cart-reservation__support">{support}</Body>
        </div>
        <div className="cart-reservation__time-wrap">
          <span className="cart-reservation__icon" aria-hidden="true">
            T
          </span>
          <span className="cart-reservation__time">{formattedTime}</span>
        </div>
      </div>
      <ProgressBar
        className="cart-reservation__progress"
        label={`${formattedTime} remaining`}
        value={Math.max(0, 100 - progress)}
        variant={isCritical ? "flash" : isUrgent ? "drop" : "neutral"}
      />
    </motion.div>
  );
}
