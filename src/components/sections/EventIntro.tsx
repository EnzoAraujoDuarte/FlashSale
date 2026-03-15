import { motion } from "framer-motion";

import type { FlashEvent } from "@/types/event";

import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

interface EventIntroProps {
  event: FlashEvent;
}

export function EventIntro({ event }: EventIntroProps) {
  return (
    <Section className="event-intro" id="event-intro">
      <motion.div
        className="intro-grid"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeInUp}
      >
        <TitleBlock copy={event.introCopy} eyebrow={event.introEyebrow} title={event.introTitle} />

        <motion.div className="metric-grid" variants={staggerContainer}>
          {event.metrics.map((metric) => (
            <motion.div className={`metric-card metric-card--${metric.tone ?? "neutral"}`} key={metric.label} variants={staggerItem}>
              <span className="metric-card__value">{metric.value}</span>
              <span className="metric-card__label">{metric.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

