"use client";

import { Button } from "@/components/primitives/Button";
import { Body, Heading } from "@/components/primitives/Typography";
import { useCartStore } from "@/stores/useCartStore";

export function CartEmpty() {
  const closeCart = useCartStore((state) => state.closeCart);

  return (
    <div className="cart-empty">
      <div className="cart-empty__mark" aria-hidden="true" />
      <Heading as="h3" className="cart-empty__title">
        Your cart is empty
      </Heading>
      <Body className="cart-empty__copy">Add items before your session expires.</Body>
      <Button
        onClick={() => {
          closeCart();
          document.getElementById("sale-live")?.scrollIntoView({ behavior: "smooth" });
        }}
        variant="ghost"
      >
        Back to the grid
      </Button>
    </div>
  );
}
