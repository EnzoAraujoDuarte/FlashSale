"use client";

import { useEffect, useMemo, useState } from "react";

import { resolveStockLevel, useStockStore } from "@/stores/useStockStore";

export function useProductStock(productId: string, initialStock = 0) {
  const stock = useStockStore((state) => state.stockMap[productId]);
  const lastUpdated = useStockStore((state) => state.lastUpdated[productId] ?? 0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!lastUpdated) {
      return;
    }

    const timer = window.setInterval(() => {
      const currentTime = Date.now();

      setNow(currentTime);

      if (currentTime - lastUpdated >= 2000) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [lastUpdated]);

  return useMemo(() => {
    const resolvedStock = stock ?? initialStock;
    const level = resolveStockLevel(resolvedStock);
    const wasJustDecremented = lastUpdated > 0 && now - lastUpdated < 2000;
    const isSoldOut = level === "sold-out";
    const badgeText =
      level === "critical"
        ? `Only ${resolvedStock} left`
        : level === "low"
          ? "Selling fast"
          : level === "sold-out"
            ? "Sold out"
            : null;

    return {
      stock: resolvedStock,
      level,
      isSoldOut,
      badgeText,
      showUrgency: level === "low" || level === "critical" || level === "sold-out",
      wasJustDecremented
    };
  }, [initialStock, lastUpdated, now, stock]);
}
