"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/primitives/Button";
import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { fadeInScale } from "@/lib/motion";

export function FinalCTA() {
  return (
    <Section className="final-cta" tone="highlight">
      <motion.div
        className="final-cta__panel"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.32 }}
        variants={fadeInScale}
      >
        <TitleBlock
          align="center"
          copy="The drop opens fast, moves faster, and rewards anyone who enters with intent."
          eyebrow="Final call"
          title="Stay close to the timer. The release will not wait."
        />
        <Button
          cursor="go"
          onClick={() => document.getElementById("event-top")?.scrollIntoView({ behavior: "smooth" })}
        >
          Return to launch
        </Button>
      </motion.div>
    </Section>
  );
}
