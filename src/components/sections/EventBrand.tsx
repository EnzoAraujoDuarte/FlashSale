import { motion } from "framer-motion";

import type { FlashEvent } from "@/types/event";

import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Caption } from "@/components/primitives/Typography";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

interface EventBrandProps {
  event: FlashEvent;
}

export function EventBrand({ event }: EventBrandProps) {
  return (
    <Section className="event-brand" tone="highlight">
      <motion.div
        className="brand-grid"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeInUp}
      >
        <div className="brand-story">
          <TitleBlock
            copy={event.brandStoryCopy}
            eyebrow={event.brandEyebrow}
            title={event.brandStoryTitle}
          />
          <div className="brand-story__wordmark">{event.brand}</div>
        </div>

        <motion.div className="brand-panel" variants={staggerContainer}>
          {event.signals.map((signal) => (
            <motion.div className="signal-card" key={signal.label} variants={staggerItem}>
              <Caption>{signal.label}</Caption>
              <span className="signal-card__value">{signal.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

