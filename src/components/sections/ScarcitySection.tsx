import { motion } from "framer-motion";

import type { FlashEvent } from "@/types/event";

import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { AnimatedMetricValue } from "@/components/ui/AnimatedMetricValue";

interface ScarcitySectionProps {
  event: FlashEvent;
}

export function ScarcitySection({ event }: ScarcitySectionProps) {
  return (
    <Section className="scarcity-section" tone="surface">
      <motion.div
        className="scarcity-grid"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeInUp}
      >
        <div className="scarcity-copy">
          <TitleBlock
            copy="Urgency is carried by structure here: clear releases, tight supply, and enough visual calm to keep every cue legible."
            eyebrow="Scarcity profile"
            title="Controlled pressure, not visual chaos."
          />
        </div>

        <motion.div className="scarcity-cards" variants={staggerContainer}>
          {event.scarcityStats.map((metric) => (
            <motion.div className={`scarcity-card scarcity-card--${metric.tone ?? "neutral"}`} key={metric.label} variants={staggerItem}>
              <span className="scarcity-card__value">
                <AnimatedMetricValue value={metric.value} />
              </span>
              <span className="scarcity-card__label">{metric.label}</span>
              {metric.hint ? <span className="scarcity-card__hint">{metric.hint}</span> : null}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}
