import type { QueueEntry } from "@/types/queue";

export const queueMock: QueueEntry = {
  userId: "guest-847",
  position: 847,
  initialPosition: 847,
  totalInQueue: 3200,
  currentQueueSize: 3200,
  estimatedWait: 48,
  batchNumber: 12,
  totalBatches: 48,
  batchSize: 56,
  releaseInterval: 3200,
  status: "idle",
  progress: 0,
  accessEndsAt: null
};
