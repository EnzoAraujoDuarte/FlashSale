import { create } from "zustand";

import { queueMock } from "@/mocks/queue";
import type { QueueEntry, QueueStatus } from "@/types/queue";

function getEstimatedWait(position: number, batchSize: number, releaseInterval: number) {
  if (position <= 0) {
    return 0;
  }

  const roundsRemaining = Math.ceil(position / Math.max(batchSize, 1));
  return Math.max(0, roundsRemaining * Math.max(1, Math.round(releaseInterval / 1000)));
}

interface QueueStore extends QueueEntry {
  initQueue: (config?: Partial<QueueEntry>) => void;
  advanceQueue: (amount: number) => void;
  setStatus: (status: QueueStatus) => void;
  admitUser: (accessDurationSeconds?: number) => void;
  expireUser: () => void;
  resetQueue: () => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  ...queueMock,
  initQueue: (config) =>
    set((state) => ({
      ...queueMock,
      ...config,
      accessEndsAt: null,
      estimatedWait: getEstimatedWait(
        config?.position ?? state.initialPosition,
        config?.batchSize ?? state.batchSize,
        config?.releaseInterval ?? state.releaseInterval
      ),
      progress: 0,
      status: "waiting"
    })),
  advanceQueue: (amount) =>
    set((state) => {
      const nextPosition = Math.max(0, state.position - amount);
      const nextQueueSize = Math.max(
        nextPosition,
        state.currentQueueSize - Math.max(amount, Math.round(amount * 1.4))
      );

      return {
        position: nextPosition,
        currentQueueSize: nextQueueSize,
        progress:
          state.initialPosition <= 0
            ? 100
            : Math.max(
                0,
                Math.min(
                  100,
                  Math.round(
                    ((state.initialPosition - nextPosition) / state.initialPosition) * 100
                  )
                )
              ),
        estimatedWait: getEstimatedWait(nextPosition, state.batchSize, state.releaseInterval),
        batchNumber: Math.min(state.totalBatches, state.batchNumber + 1),
        status: state.status === "waiting" ? "processing" : state.status
      };
    }),
  setStatus: (status) => set({ status }),
  admitUser: (accessDurationSeconds = 12) =>
    set((state) => ({
      position: 0,
      currentQueueSize: Math.max(0, state.currentQueueSize - state.batchSize),
      estimatedWait: 0,
      progress: 100,
      status: "admitted",
      accessEndsAt: new Date(Date.now() + accessDurationSeconds * 1000)
    })),
  expireUser: () =>
    set({
      status: "expired",
      accessEndsAt: null
    }),
  resetQueue: () => set(queueMock)
}));
