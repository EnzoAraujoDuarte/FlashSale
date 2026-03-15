"use client";

import { useEffect } from "react";

import { eventSimulator } from "@/lib/simulators/eventSimulator";
import { queueSimulator } from "@/lib/simulators/queueSimulator";
import { stockSimulator } from "@/lib/simulators/stockSimulator";
import { useCartStore } from "@/stores/useCartStore";
import { useEventStore } from "@/stores/useEventStore";
import { useQueueStore } from "@/stores/useQueueStore";
import { useStockStore } from "@/stores/useStockStore";
import type { Product } from "@/types/product";

export function useEventLifecycle(products: Product[]) {
  const phase = useEventStore((state) => state.phase);
  const queueStatus = useQueueStore((state) => state.status);

  useEffect(() => {
    useStockStore.getState().initStock(products);
  }, [products]);

  useEffect(() => {
    eventSimulator.start();

    return () => {
      eventSimulator.stop();
      queueSimulator.stop();
      stockSimulator.stop();
    };
  }, []);

  useEffect(() => {
    if (phase === "PRE_SALE") {
      queueSimulator.stop();
      stockSimulator.stop();
      useCartStore.getState().closeCart();
      useStockStore.getState().initStock(products);
      return;
    }

    if (phase === "QUEUE_OPEN") {
      useQueueStore.getState().initQueue();
      stockSimulator.stop();
      queueSimulator.start();
      useCartStore.getState().closeCart();
      useStockStore.getState().initStock(products);
      return;
    }

    if (phase === "SALE_ACTIVE") {
      queueSimulator.stop();
      useStockStore.getState().initStock(products);
      stockSimulator.start(products);
      return;
    }

    if (phase === "SALE_ENDED") {
      queueSimulator.stop();
      stockSimulator.stop();
      useCartStore.getState().closeCart();
      return;
    }

    if (phase !== "QUEUE_PROCESSING") {
      queueSimulator.stop();
      stockSimulator.stop();
    }
  }, [phase, products]);

  useEffect(() => {
    if ((phase === "QUEUE_OPEN" || phase === "QUEUE_PROCESSING") && queueStatus !== "admitted") {
      queueSimulator.start();
      return;
    }

    if ((phase !== "QUEUE_OPEN" && phase !== "QUEUE_PROCESSING") || queueStatus === "admitted") {
      queueSimulator.stop();
    }
  }, [phase, queueStatus]);
}
