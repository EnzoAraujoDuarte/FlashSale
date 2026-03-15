export type QueueStatus = "idle" | "waiting" | "processing" | "admitted" | "expired";

export interface QueueEntry {
  userId: string;
  position: number;
  initialPosition: number;
  totalInQueue: number;
  currentQueueSize: number;
  estimatedWait: number;
  batchNumber: number;
  totalBatches: number;
  batchSize: number;
  releaseInterval: number;
  status: QueueStatus;
  progress: number;
  accessEndsAt: Date | null;
}

export interface QueueProgressResult {
  position: number;
  formattedPosition: string;
  totalInQueue: number;
  formattedTotal: string;
  currentQueueSize: number;
  progress: number;
  estimatedWait: string;
  batchInfo: string;
  statusMessage: string;
  isAdmitted: boolean;
  isProcessing: boolean;
}
