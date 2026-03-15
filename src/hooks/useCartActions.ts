"use client";

import { useEffect, useRef, useState } from "react";

import type { CartAddResult } from "@/types/cart";
import type { Product } from "@/types/product";

import { useCartFlight } from "@/hooks/useCartFlight";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/stores/useCartStore";
import { useStockStore } from "@/stores/useStockStore";

type CartActionStatus = "idle" | "loading" | "success" | "error" | "reserved";

interface AddToCartPayload {
  product: Product;
  size: string;
  sourceElement: HTMLElement | null;
}

interface RemoveFromCartPayload {
  productId: string;
  size: string;
  name: string;
}

export function useCartActions() {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const { animateToCart } = useCartFlight();
  const { showToast } = useToast();
  const [status, setStatus] = useState<CartActionStatus>("idle");
  const [lastError, setLastError] = useState<Exclude<CartAddResult, "success"> | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const scheduleReset = () => {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
      setLastError(null);
    }, 1500);
  };

  const addToCart = async ({ product, size, sourceElement }: AddToCartPayload) => {
    setStatus("loading");
    setLastError(null);

    const result = addItem(product, size);

    if (result === "out-of-stock") {
      setStatus("error");
      setLastError(result);
      showToast({
        variant: "error",
        title: "Product sold out",
        description: `${product.name} is no longer available.`
      });
      scheduleReset();
      return result;
    }

    if (result === "already-in-cart") {
      setStatus("reserved");
      setLastError(result);
      openCart();
      showToast({
        variant: "info",
        title: "Already reserved",
        description: `${product.name} is already in your cart.`
      });
      scheduleReset();
      return result;
    }

    await animateToCart({
      imageSrc: product.images[0],
      sourceElement
    });

    openCart();
    setStatus("success");

    const remainingStock = useStockStore.getState().stockMap[product.id] ?? 0;

    showToast({
      variant: remainingStock <= 3 ? "warning" : "success",
      title: remainingStock <= 3 ? "Reserved. Stock is almost gone." : "Added to cart",
      description: `${product.name} is reserved for 10 minutes.`
    });

    scheduleReset();

    return result;
  };

  const removeFromCart = ({ name, productId, size }: RemoveFromCartPayload) => {
    removeItem(productId, size);
    showToast({
      variant: "info",
      title: "Removed from cart",
      description: `${name} was released back to the drop.`
    });
  };

  return {
    addToCart,
    removeFromCart,
    isAdding: status === "loading",
    lastError,
    status
  };
}
