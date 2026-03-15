"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { useQueueStore } from "@/stores/useQueueStore";
import { useStockStore } from "@/stores/useStockStore";

interface EventTickerProps {
  fallbackPiecesRemaining?: number;
}

export function EventTicker({ fallbackPiecesRemaining = 0 }: EventTickerProps) {
  const prefersReducedMotion = useReducedMotion();
  const queueSize = useQueueStore((state) => state.currentQueueSize);
  const piecesRemaining = useStockStore((state) =>
    Object.keys(state.stockMap).length
      ? Object.values(state.stockMap).reduce((total, quantity) => total + quantity, 0)
      : fallbackPiecesRemaining
  );

  const items = useMemo(
    () => [
      "Sale is live",
      `${queueSize.toLocaleString()} still waiting`,
      `${piecesRemaining} tracked pieces remaining`,
      "Featured units are moving fastest"
    ],
    [piecesRemaining, queueSize]
  );

  const track = [...items, ...items];

  return (
    <div className="event-ticker" aria-label="Live event activity">
      {prefersReducedMotion ? (
        <div className="event-ticker__track event-ticker__track--static">
          {items.map((item) => (
            <div className="event-ticker__item" key={item}>
              <span className="event-ticker__dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          className="event-ticker__track"
          transition={{ duration: 16, ease: "linear", repeat: Infinity }}
        >
          {track.map((item, index) => (
            <div className="event-ticker__item" key={`${item}-${index}`}>
              <span className="event-ticker__dot" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
