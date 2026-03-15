"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { Body } from "@/components/primitives/Typography";
import { useToast } from "@/hooks/useToast";
import { demoPhaseLabels, goToDemoPhase, restartDemoEvent } from "@/lib/demo";
import { fadeInScale } from "@/lib/motion";
import { stockSimulator } from "@/lib/simulators/stockSimulator";
import { useEventStore } from "@/stores/useEventStore";
import { useQueueStore } from "@/stores/useQueueStore";
import type { EventPhase } from "@/types/event";

const EVENT_PHASES = Object.keys(demoPhaseLabels) as EventPhase[];

export function DemoController() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const phase = useEventStore((state) => state.phase);
  const queueStatus = useQueueStore((state) => state.status);
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const phaseButtons = useMemo(
    () =>
      EVENT_PHASES.map((eventPhase) => ({
        id: eventPhase,
        label: demoPhaseLabels[eventPhase],
        isActive: eventPhase === phase
      })),
    [phase]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="demo-controller" data-no-cursor ref={panelRef}>
      <button
        aria-expanded={isOpen}
        className="demo-controller__trigger"
        data-no-cursor
        onClick={() => setIsOpen((state) => !state)}
        type="button"
      >
        Demo
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate="animate"
            className="demo-controller__panel"
            data-no-cursor
            exit="exit"
            initial="initial"
            variants={fadeInScale}
          >
            <div className="demo-controller__section">
              <span className="demo-controller__eyebrow">Event phases</span>
              <div className="demo-controller__phase-list">
                {phaseButtons.map((phaseButton) => (
                  <button
                    className={`demo-controller__phase ${
                      phaseButton.isActive ? "demo-controller__phase--active" : ""
                    }`}
                    data-no-cursor
                    key={phaseButton.id}
                    onClick={() => {
                      goToDemoPhase(phaseButton.id);
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    <span>{phaseButton.label}</span>
                    {phaseButton.isActive ? <span className="demo-controller__dot" /> : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="demo-controller__section">
              <span className="demo-controller__eyebrow">Quick actions</span>
              <div className="demo-controller__actions">
                <button
                  className="demo-controller__action"
                  data-no-cursor
                  onClick={() => {
                    restartDemoEvent();
                    setIsOpen(false);
                    showToast({
                      variant: "info",
                      title: "Demo restarted",
                      description: "The event is back in pre-sale with a fresh countdown."
                    });
                  }}
                  type="button"
                >
                  Restart
                </button>
                <button
                  className="demo-controller__action"
                  data-no-cursor
                  disabled={phase !== "QUEUE_PROCESSING" || queueStatus === "admitted"}
                  onClick={() => {
                    useQueueStore.getState().admitUser(10);
                    showToast({
                      variant: "success",
                      title: "Queue skipped",
                      description: "The session was admitted immediately."
                    });
                  }}
                  type="button"
                >
                  Skip queue
                </button>
                <button
                  className="demo-controller__action"
                  data-no-cursor
                  disabled={phase !== "SALE_ACTIVE"}
                  onClick={() => {
                    stockSimulator.fastForward(30_000);
                    showToast({
                      variant: "warning",
                      title: "Stock rush enabled",
                      description: "Live stock decay is accelerated for the next 30 seconds."
                    });
                  }}
                  type="button"
                >
                  Fast forward stock
                </button>
              </div>
            </div>

            <Body className="demo-controller__note">
              Jump between phases without waiting for the live timers.
            </Body>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
