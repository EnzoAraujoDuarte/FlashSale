"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Heading } from "@/components/primitives/Typography";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { fadeIn, slideInRight } from "@/lib/motion";
import { useCartStore } from "@/stores/useCartStore";

import { CartEmpty } from "./CartEmpty";
import { CartItem } from "./CartItem";
import { CartReservationTimer } from "./CartReservationTimer";
import { CartSummary } from "./CartSummary";

export function CartDrawer() {
  const drawerRef = useRef<HTMLElement | null>(null);
  const closeCart = useCartStore((state) => state.closeCart);
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const savings = useCartStore((state) => state.savings);
  const total = useCartStore((state) => state.total);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useScrollLock(isOpen);
  useFocusTrap({
    active: isOpen,
    containerRef: drawerRef,
    onEscape: closeCart
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Close cart"
            className="cart-drawer__overlay"
            data-no-cursor
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={closeCart}
            type="button"
            variants={fadeIn}
          />

          <motion.aside
            aria-label="Your cart"
            aria-modal="true"
            className="cart-drawer"
            data-no-cursor
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragDirectionLock
            dragElastic={{ left: 0, right: 0.14 }}
            dragMomentum={false}
            initial="initial"
            animate="animate"
            exit="exit"
            onDragEnd={(_, info) => {
              if (info.offset.x > 80) {
                closeCart();
              }
            }}
            ref={drawerRef}
            role="dialog"
            tabIndex={-1}
            variants={slideInRight}
          >
            <div className="cart-drawer__header">
              <Heading as="h2" className="cart-drawer__title">
                Your cart
              </Heading>
              <button
                className="cart-drawer__close"
                data-no-cursor
                onClick={closeCart}
                type="button"
              >
                Close
              </button>
            </div>

            {items.length ? (
              <div className="cart-drawer__timer">
                <CartReservationTimer />
              </div>
            ) : null}

            <div className="cart-drawer__body">
              {items.length ? (
                <div className="cart-drawer__items">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem item={item} key={`${item.productId}-${item.size}`} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <CartEmpty />
              )}
            </div>

            {items.length ? (
              <div className="cart-drawer__footer">
                <CartSummary savings={savings} total={total} />
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
