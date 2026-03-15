"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Section } from "@/components/primitives/Section";
import { Body, Display, Label } from "@/components/primitives/Typography";
import { useCountdown } from "@/hooks/useCountdown";
import { fadeInScale } from "@/lib/motion";
import { useEventStore } from "@/stores/useEventStore";
import { useQueueStore } from "@/stores/useQueueStore";

import { CountdownCompact } from "./CountdownCompact";

export function QueueAdmitted() {
  const accessEndsAt = useQueueStore((state) => state.accessEndsAt);
  const setPhase = useEventStore((state) => state.setPhase);
  const hasTransitionedRef = useRef(false);
  const countdown = useCountdown(accessEndsAt ?? new Date(Date.now() + 10_000));

  useEffect(() => {
    if (countdown.isExpired && !hasTransitionedRef.current) {
      hasTransitionedRef.current = true;
      setPhase("SALE_ACTIVE");
    }
  }, [countdown.isExpired, setPhase]);

  return (
    <Section className="queue-admitted" tone="highlight">
      <motion.div
        className="queue-admitted__panel"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInScale}
      >
        <Badge variant="live" withDot>
          Access granted
        </Badge>
        <div className="queue-admitted__copy">
          <Label>Queue cleared</Label>
          <Display className="queue-admitted__title">You&apos;re in.</Display>
          <Body>
            The gate is open for your session. Enter now or wait for the auto-transition to carry you
            into the live sale.
          </Body>
        </div>
        {accessEndsAt ? <CountdownCompact label="Auto entry" targetDate={accessEndsAt} /> : null}
        <Button fullWidth onClick={() => setPhase("SALE_ACTIVE")}>
          Enter the sale
        </Button>
      </motion.div>
    </Section>
  );
}
