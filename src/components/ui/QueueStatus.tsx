"use client";

import { motion } from "framer-motion";

import type { EventPhase } from "@/types/event";

import { Badge } from "@/components/primitives/Badge";
import { Section } from "@/components/primitives/Section";
import { Body, Heading, Label } from "@/components/primitives/Typography";
import { useQueueProgress } from "@/hooks/useQueueProgress";
import { fadeInScale } from "@/lib/motion";
import { useQueueStore } from "@/stores/useQueueStore";

import { QueuePosition } from "./QueuePosition";
import { QueueProgress } from "./QueueProgress";

interface QueueStatusProps {
  phase: Extract<EventPhase, "QUEUE_OPEN" | "QUEUE_PROCESSING">;
}

export function QueueStatus({ phase }: QueueStatusProps) {
  const queue = useQueueProgress();
  const releaseInterval = useQueueStore((state) => Math.round(state.releaseInterval / 1000));
  const batchSize = useQueueStore((state) => state.batchSize);
  const title =
    phase === "QUEUE_OPEN"
      ? "Your lane is locked and the first wave is preparing."
      : "The system is releasing access in controlled waves.";
  const copy =
    phase === "QUEUE_OPEN"
      ? "The queue is active, your slot is stable, and the platform is syncing the first release cadence."
      : "Position, batch, and wait time are updating in real time as new customers are admitted.";

  return (
    <Section className="queue-screen" tone="surface">
      <motion.div
        className="queue-screen__shell"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInScale}
      >
        <div className="queue-screen__intro">
          <Badge variant={phase === "QUEUE_OPEN" ? "warning" : "live"} withDot>
            Virtual queue
          </Badge>
          <div className="queue-screen__copy">
            <Label>{phase === "QUEUE_OPEN" ? "Queue open" : "Queue processing"}</Label>
            <Heading className="queue-screen__title">{title}</Heading>
            <Body>{copy}</Body>
          </div>
        </div>

        <div className="queue-screen__grid">
          <QueuePosition
            formattedPosition={queue.formattedPosition}
            formattedTotal={queue.formattedTotal}
          />

          <div className="queue-screen__aside">
            <QueueProgress
              batchInfo={queue.batchInfo}
              currentQueueSize={queue.currentQueueSize.toLocaleString()}
              estimatedWait={queue.estimatedWait}
              progress={queue.progress}
              statusMessage={queue.statusMessage}
            />

            <div className="queue-screen__stats">
              <div className="queue-screen__stat">
                <span className="queue-screen__stat-value">{batchSize}</span>
                <span className="queue-screen__stat-label">slots per wave</span>
              </div>
              <div className="queue-screen__stat">
                <span className="queue-screen__stat-value">{releaseInterval}s</span>
                <span className="queue-screen__stat-label">release cadence</span>
              </div>
              <div className="queue-screen__stat">
                <span className="queue-screen__stat-value">
                  {Math.max(1, Math.ceil(queue.position / Math.max(batchSize, 1)))}
                </span>
                <span className="queue-screen__stat-label">waves remaining</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

