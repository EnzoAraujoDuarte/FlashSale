import type { Product } from "@/types/product";

import { useStockStore } from "@/stores/useStockStore";

let timeoutId: ReturnType<typeof setTimeout> | null = null;
let startedAt = 0;
let activeProducts: Product[] = [];
let boostedUntil = 0;

function weightedPick(productIds: string[]) {
  const pool = productIds.flatMap((productId) => {
    const product = activeProducts.find((entry) => entry.id === productId);
    const weight = product?.isFeatured ? 3 : 1;

    return Array.from({ length: weight }, () => productId);
  });

  return pool[Math.floor(Math.random() * pool.length)];
}

function getNextDelay() {
  const elapsed = Date.now() - startedAt;
  const isBoosted = Date.now() < boostedUntil;

  if (isBoosted) {
    return Math.round(320 + Math.random() * 420);
  }

  if (elapsed < 60_000) {
    return Math.round(1200 + Math.random() * 1400);
  }

  return Math.round(3000 + Math.random() * 5000);
}

function simulateTick() {
  const stock = useStockStore.getState();
  const eligibleProductIds = Object.entries(stock.stockMap)
    .filter(([, quantity]) => quantity > 0)
    .map(([productId]) => productId);

  if (!eligibleProductIds.length) {
    stockSimulator.stop();
    return false;
  }

  const productId = weightedPick(eligibleProductIds);

  if (productId) {
    const product = activeProducts.find((entry) => entry.id === productId);
    const amount = product?.isFeatured && Math.random() > 0.66 ? 2 : 1;

    stock.decrementStock(productId, amount);
  }

  return true;
}

function scheduleNextTick() {
  timeoutId = setTimeout(() => {
    const hasMoreStock = simulateTick();

    if (!hasMoreStock) {
      return;
    }

    scheduleNextTick();
  }, getNextDelay());
}

export const stockSimulator = {
  start(products: Product[]) {
    activeProducts = products;

    if (timeoutId) {
      return;
    }

    startedAt = Date.now();
    scheduleNextTick();
  },
  fastForward(durationMs = 30_000) {
    if (!activeProducts.length) {
      return;
    }

    boostedUntil = Math.max(boostedUntil, Date.now() + durationMs);
    const hasMoreStock = simulateTick();

    if (!hasMoreStock) {
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (!startedAt) {
      startedAt = Date.now();
    }

    scheduleNextTick();
  },
  stop() {
    if (!timeoutId) {
      boostedUntil = 0;
      startedAt = 0;
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = null;
    boostedUntil = 0;
    startedAt = 0;
  },
  reset() {
    this.stop();
    useStockStore.getState().initStock(activeProducts);
  }
};
