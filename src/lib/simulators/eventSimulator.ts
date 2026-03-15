import { useCartStore } from "@/stores/useCartStore";
import { useEventStore } from "@/stores/useEventStore";
import { useQueueStore } from "@/stores/useQueueStore";

import { queueSimulator } from "./queueSimulator";
import { stockSimulator } from "./stockSimulator";

let intervalId: ReturnType<typeof setInterval> | null = null;

function tick() {
  const eventStore = useEventStore.getState();
  const queueStore = useQueueStore.getState();
  const cartStore = useCartStore.getState();

  const now = Date.now();
  const saleStartsAt = eventStore.event.saleStartsAt.getTime();
  const saleEndsAt = saleStartsAt + eventStore.event.saleDuration * 60 * 1000;
  const phaseAge = now - eventStore.phaseStartedAt.getTime();

  if (eventStore.phase === "PRE_SALE" && now >= saleStartsAt) {
    eventStore.setPhase("QUEUE_OPEN");
    queueStore.setStatus("waiting");
    return;
  }

  if (eventStore.phase === "QUEUE_OPEN" && phaseAge >= 4 * 1000) {
    eventStore.setPhase("QUEUE_PROCESSING");
    queueStore.setStatus("processing");
    return;
  }

  if (eventStore.phase === "SALE_ACTIVE" && now >= saleEndsAt) {
    eventStore.setPhase("SALE_ENDED");
    cartStore.clearCart();
    cartStore.closeCart();
    return;
  }
}

export const eventSimulator = {
  start() {
    if (intervalId) {
      return;
    }

    intervalId = setInterval(tick, 1000);
  },
  stop() {
    if (!intervalId) {
      return;
    }

    clearInterval(intervalId);
    intervalId = null;
  },
  reset() {
    this.stop();
    queueSimulator.stop();
    useCartStore.getState().clearCart();
    stockSimulator.reset();
    useEventStore.getState().initEvent();
    useQueueStore.getState().resetQueue();
    this.start();
  }
};
