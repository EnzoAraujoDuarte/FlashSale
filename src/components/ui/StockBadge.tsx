"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Badge } from "@/components/primitives/Badge";
import { useProductStock } from "@/hooks/useProductStock";
import { cn } from "@/lib/cn";
import { fadeInScale, urgencyPulse } from "@/lib/motion";

interface StockBadgeProps {
  productId: string;
  initialStock?: number;
  className?: string;
}

export function StockBadge({ className, initialStock = 0, productId }: StockBadgeProps) {
  const { badgeText, level } = useProductStock(productId, initialStock);

  if (!badgeText) {
    return null;
  }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={`${productId}-${level}-${badgeText}`}
        className={cn("stock-badge-wrap", className)}
        initial="initial"
        exit="exit"
        animate="animate"
        variants={fadeInScale}
      >
        <motion.div
          animate={level === "critical" ? "animate" : undefined}
          variants={urgencyPulse}
        >
          <Badge
            className={cn("stock-badge", `stock-badge--${level}`)}
            size="sm"
            variant={
              level === "low"
                ? "warning"
                : level === "critical"
                  ? "urgency"
                  : level === "sold-out"
                    ? "neutral"
                    : "neutral"
            }
          >
            {badgeText}
          </Badge>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
