"use client";

import { useMemo } from "react";

import { useQueueStore } from "@/stores/useQueueStore";

export function useQueueProgress() {
  const queue = useQueueStore((state) => ({
    batchNumber: state.batchNumber,
    currentQueueSize: state.currentQueueSize,
    estimatedWait: state.estimatedWait,
    position: state.position,
    progress: state.progress,
    status: state.status,
    totalBatches: state.totalBatches,
    totalInQueue: state.totalInQueue
  }));

  return useMemo(() => {
    const estimatedWait =
      queue.estimatedWait >= 60
        ? `~${Math.max(1, Math.ceil(queue.estimatedWait / 60))} min`
        : `~${Math.max(1, queue.estimatedWait)} sec`;

    const statusMessage =
      queue.status === "waiting"
        ? "Securing your slot and syncing the first release wave."
        : queue.position > 500
          ? "Hang tight, we are moving quickly through the early waves."
          : queue.position > 100
            ? "Almost there. Just a few more controlled releases."
            : queue.position > 0
              ? "You are next. Keep this screen open."
              : "Access granted. Your lane is ready.";

    return {
      position: queue.position,
      formattedPosition: queue.position.toLocaleString(),
      totalInQueue: queue.totalInQueue,
      formattedTotal: queue.totalInQueue.toLocaleString(),
      currentQueueSize: queue.currentQueueSize,
      progress: queue.progress,
      estimatedWait,
      batchInfo: `Batch ${queue.batchNumber} of ${queue.totalBatches}`,
      statusMessage,
      isAdmitted: queue.status === "admitted",
      isProcessing: queue.status === "processing"
    };
  }, [queue]);
}

