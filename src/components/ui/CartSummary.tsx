"use client";

import { Button } from "@/components/primitives/Button";
import { Body } from "@/components/primitives/Typography";
import { useToast } from "@/hooks/useToast";

interface CartSummaryProps {
  total: number;
  savings: number;
}

export function CartSummary({ savings, total }: CartSummaryProps) {
  const { showToast } = useToast();

  return (
    <div className="cart-summary">
      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span className="cart-summary__label">Subtotal</span>
          <span className="cart-summary__value">${total}</span>
        </div>
        <div className="cart-summary__row">
          <span className="cart-summary__label">You save</span>
          <span className="cart-summary__value cart-summary__value--success">${savings}</span>
        </div>
      </div>

      <Button
        fullWidth
        onClick={() =>
          showToast({
            variant: "info",
            title: "Checkout handoff ready",
            description: "The payment step plugs in here without changing the reservation flow."
          })
        }
      >
        Checkout now
      </Button>

      <Body className="cart-summary__note">
        Slots are moving fast. Complete your purchase before the reservation releases.
      </Body>
    </div>
  );
}
