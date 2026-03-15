"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/primitives/Badge";
import { Section } from "@/components/primitives/Section";
import { Body, Display, Label } from "@/components/primitives/Typography";
import { fadeInScale } from "@/lib/motion";

export function QueueLineIntro() {
  return (
    <Section className="queue-line-intro" tone="surface">
      <motion.div
        animate="animate"
        className="queue-line-intro__panel"
        initial="initial"
        variants={fadeInScale}
      >
        <Badge variant="warning" withDot>
          Queue synced
        </Badge>
        <div className="queue-line-intro__copy">
          <Label>You&apos;re in line</Label>
          <Display className="queue-line-intro__title">Your slot is locked.</Display>
          <Body>
            We&apos;re routing you into the first controlled wave now. Live queue metrics follow in a
            moment.
          </Body>
        </div>
      </motion.div>
    </Section>
  );
}
