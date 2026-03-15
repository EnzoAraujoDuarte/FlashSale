import { createEventMock } from "@/mocks/event";
import { queueMock } from "@/mocks/queue";
import { eventSimulator } from "@/lib/simulators/eventSimulator";
import { useCartStore } from "@/stores/useCartStore";
import { useEventStore } from "@/stores/useEventStore";
import { useQueueStore } from "@/stores/useQueueStore";
import type { EventPhase } from "@/types/event";

const SALE_ACTIVE_REMAINING_MINUTES = 5;

export const demoPhaseLabels: Record<EventPhase, string> = {
  PRE_SALE: "Pre-sale",
  QUEUE_OPEN: "Queue open",
  QUEUE_PROCESSING: "Queue moving",
  SALE_ACTIVE: "Sale active",
  SALE_ENDED: "Sale ended"
};

function getDemoSaleStart(phase: EventPhase) {
  const baseEvent = createEventMock();
  const now = Date.now();

  if (phase === "PRE_SALE") {
    return baseEvent.saleStartsAt;
  }

  if (phase === "SALE_ACTIVE") {
    return new Date(now - (baseEvent.saleDuration - SALE_ACTIVE_REMAINING_MINUTES) * 60 * 1000);
  }

  if (phase === "SALE_ENDED") {
    return new Date(now - (baseEvent.saleDuration + 1) * 60 * 1000);
  }

  return new Date(now - 3_000);
}

function getProcessingQueueSeed() {
  return {
    ...queueMock,
    position: 214,
    initialPosition: 214,
    totalInQueue: 3200,
    currentQueueSize: 912,
    estimatedWait: 12,
    batchNumber: 31,
    totalBatches: 48,
    batchSize: 75,
    releaseInterval: 3200,
    status: "processing" as const,
    progress: 76,
    accessEndsAt: null
  };
}

export function restartDemoEvent() {
  eventSimulator.reset();
}

export function goToDemoPhase(phase: EventPhase) {
  const cartStore = useCartStore.getState();
  const queueStore = useQueueStore.getState();
  const eventStore = useEventStore.getState();

  cartStore.clearCart();
  cartStore.closeCart();
  queueStore.resetQueue();

  if (phase === "QUEUE_PROCESSING") {
    queueStore.initQueue(getProcessingQueueSeed());
    queueStore.setStatus("processing");
  }

  if (phase === "QUEUE_OPEN") {
    queueStore.initQueue();
    queueStore.setStatus("waiting");
  }

  if (phase === "SALE_ACTIVE") {
    queueStore.admitUser(12);
  }

  eventStore.initEvent(
    createEventMock({
      phase,
      saleStartsAt: getDemoSaleStart(phase)
    })
  );
}
