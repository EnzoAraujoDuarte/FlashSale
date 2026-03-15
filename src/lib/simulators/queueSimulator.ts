import { useQueueStore } from "@/stores/useQueueStore";

let timeoutId: ReturnType<typeof setTimeout> | null = null;

function getReleaseAmount(batchSize: number) {
  return Math.max(30, Math.round(batchSize * (0.8 + Math.random() * 0.4)));
}

function getNextDelay(releaseInterval: number) {
  return Math.max(2200, Math.min(4000, Math.round(releaseInterval * (0.8 + Math.random() * 0.35))));
}

function scheduleNextTick() {
  const queue = useQueueStore.getState();

  if (queue.status === "admitted" || queue.status === "expired") {
    queueSimulator.stop();
    return;
  }

  timeoutId = setTimeout(() => {
    const freshQueue = useQueueStore.getState();
    const releaseAmount = getReleaseAmount(freshQueue.batchSize);

    freshQueue.advanceQueue(releaseAmount);

    if (useQueueStore.getState().position <= 0) {
      useQueueStore.getState().admitUser(10);
      queueSimulator.stop();
      return;
    }

    scheduleNextTick();
  }, getNextDelay(queue.releaseInterval));
}

export const queueSimulator = {
  start() {
    const queue = useQueueStore.getState();

    if (timeoutId || queue.status === "admitted" || queue.status === "expired") {
      return;
    }

    queue.setStatus("processing");
    scheduleNextTick();
  },
  stop() {
    if (!timeoutId) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = null;
  },
  reset() {
    this.stop();
    useQueueStore.getState().resetQueue();
  }
};

