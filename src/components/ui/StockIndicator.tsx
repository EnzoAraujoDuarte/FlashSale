"use client";

import { motion } from "framer-motion";

import { useProductStock } from "@/hooks/useProductStock";
import { cn } from "@/lib/cn";
import { feedbackPulse } from "@/lib/motion";

import { ProgressBar } from "../primitives/ProgressBar";

interface StockIndicatorProps {
  productId: string;
  initialStock: number;
}

export function StockIndicator({ initialStock, productId }: StockIndicatorProps) {
  const { isSoldOut, level, stock, wasJustDecremented } = useProductStock(
    productId,
    initialStock
  );

  return (
    <motion.div
      className={cn("stock-indicator", `stock-indicator--${level}`)}
      animate={wasJustDecremented ? "animate" : undefined}
      initial={wasJustDecremented ? "initial" : undefined}
      variants={feedbackPulse}
    >
      <ProgressBar
        label={isSoldOut ? "Sold out" : `${stock} left`}
        value={initialStock > 0 ? Math.round((stock / initialStock) * 100) : 0}
        variant={
          level === "normal"
            ? "success"
            : level === "low"
              ? "drop"
              : level === "critical"
                ? "flash"
                : "neutral"
        }
      />
    </motion.div>
  );
}
