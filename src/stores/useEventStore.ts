import { create } from "zustand";

import { createEventMock } from "@/mocks/event";
import type { FlashEvent, EventPhase } from "@/types/event";

const phaseOrder: EventPhase[] = [
  "PRE_SALE",
  "QUEUE_OPEN",
  "QUEUE_PROCESSING",
  "SALE_ACTIVE",
  "SALE_ENDED"
];

interface EventStore {
  event: FlashEvent;
  phase: EventPhase;
  phaseStartedAt: Date;
  initEvent: (event?: FlashEvent) => void;
  setPhase: (phase: EventPhase) => void;
  advancePhase: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  event: createEventMock(),
  phase: "PRE_SALE",
  phaseStartedAt: new Date(),
  initEvent: (event = createEventMock()) =>
    set({
      event,
      phase: event.phase,
      phaseStartedAt: new Date()
    }),
  setPhase: (phase) =>
    set((state) => ({
      phase,
      phaseStartedAt: new Date(),
      event: {
        ...state.event,
        phase
      }
    })),
  advancePhase: () =>
    set((state) => {
      const currentIndex = phaseOrder.indexOf(state.phase);
      const nextPhase = phaseOrder[Math.min(currentIndex + 1, phaseOrder.length - 1)];

      return {
        phase: nextPhase,
        phaseStartedAt: new Date(),
        event: {
          ...state.event,
          phase: nextPhase
        }
      };
    })
}));
