"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

import type { EventPhase } from "@/types/event";

import { Container } from "@/components/primitives/Container";
import { useCartFlight } from "@/hooks/useCartFlight";
import { cartBounce, cartCountBadge } from "@/lib/motion";
import { useCartStore } from "@/stores/useCartStore";
import { useEventStore } from "@/stores/useEventStore";

import { PhaseChip } from "./PhaseChip";

interface EventHeaderProps {
  phaseOverride?: EventPhase;
}

export function EventHeader({ phaseOverride }: EventHeaderProps) {
  const phase = useEventStore((state) => state.phase);
  const cartCount = useCartStore((state) => state.items.length);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const controls = useAnimationControls();
  const { bounceNonce, registerCartTarget } = useCartFlight();
  const previousBounceNonceRef = useRef(bounceNonce);

  useEffect(() => {
    if (bounceNonce === previousBounceNonceRef.current) {
      return;
    }

    previousBounceNonceRef.current = bounceNonce;
    controls.start("animate");
  }, [bounceNonce, controls]);

  return (
    <header className="event-header">
      <Container className="event-header__inner">
        <Link className="event-header__brand" href="/">
          <span className="event-header__brand-mark">Flash Sale Engine</span>
          <span className="event-header__brand-sub">Aether Division event studio</span>
        </Link>

        <PhaseChip phase={phaseOverride ?? phase} />

        <motion.button
          aria-label={`Toggle cart drawer${cartCount ? `, ${cartCount} items reserved` : ""}`}
          animate={controls}
          className="event-header__cart"
          initial="initial"
          onClick={toggleCart}
          ref={(node) => registerCartTarget(node)}
          type="button"
          variants={cartBounce}
        >
          <span className="event-header__cart-icon-wrap">
            <span className="event-header__cart-icon" aria-hidden="true">
              <span className="event-header__cart-icon-handle" />
              <span className="event-header__cart-icon-body" />
            </span>
            <AnimatePresence>
              {cartCount > 0 ? (
                <motion.span
                  animate="animate"
                  className="event-header__cart-badge"
                  exit="exit"
                  initial="initial"
                  key={cartCount}
                  variants={cartCountBadge}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
          <span className="event-header__cart-label">Cart</span>
        </motion.button>
      </Container>
    </header>
  );
}
