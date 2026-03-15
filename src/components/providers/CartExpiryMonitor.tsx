"use client";

import { useEffect, useRef } from "react";

import { useCartExpiry } from "@/hooks/useCartExpiry";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/stores/useCartStore";

export function CartExpiryMonitor() {
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartStore((state) => state.items.length);
  const { formattedTime, isCritical, isExpired, isUrgent } = useCartExpiry();
  const { showToast } = useToast();
  const urgentNotifiedRef = useRef(false);
  const criticalNotifiedRef = useRef(false);
  const expiredNotifiedRef = useRef(false);

  useEffect(() => {
    if (!itemCount) {
      urgentNotifiedRef.current = false;
      criticalNotifiedRef.current = false;
      expiredNotifiedRef.current = false;
      return;
    }

    if (isUrgent && !urgentNotifiedRef.current) {
      urgentNotifiedRef.current = true;
      showToast({
        variant: "info",
        title: "Reservation running low",
        description: `Your hold expires in ${formattedTime}.`
      });
    }

    if (isCritical && !criticalNotifiedRef.current) {
      criticalNotifiedRef.current = true;
      showToast({
        variant: "warning",
        title: "Final minute",
        description: "Reserved items will be released if checkout is not completed."
      });
    }

    if (isExpired && !expiredNotifiedRef.current) {
      expiredNotifiedRef.current = true;
      clearCart();
      showToast({
        variant: "error",
        title: "Reservation expired",
        description: "The reserved pieces were released back to the drop."
      });
    }
  }, [clearCart, formattedTime, isCritical, isExpired, isUrgent, itemCount, showToast]);

  return null;
}
