"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { cartFlightTransition } from "@/lib/motion";

interface FlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface FlightState {
  id: string;
  imageSrc: string;
  source: FlightRect;
  target: FlightRect;
}

interface CartFlightContextValue {
  animateToCart: (payload: {
    imageSrc: string;
    sourceElement: HTMLElement | null;
  }) => Promise<void>;
  bounceNonce: number;
  registerCartTarget: (node: HTMLElement | null) => void;
}

const CartFlightContext = createContext<CartFlightContextValue | null>(null);

function toRect(element: HTMLElement): FlightRect {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

interface CartFlightProviderProps {
  children: ReactNode;
}

export function CartFlightProvider({ children }: CartFlightProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const cartTargetRef = useRef<HTMLElement | null>(null);
  const resolverRef = useRef<(() => void) | null>(null);
  const [bounceNonce, setBounceNonce] = useState(0);
  const [flight, setFlight] = useState<FlightState | null>(null);

  const registerCartTarget = (node: HTMLElement | null) => {
    cartTargetRef.current = node;
  };

  const animateToCart = ({
    imageSrc,
    sourceElement
  }: {
    imageSrc: string;
    sourceElement: HTMLElement | null;
  }) => {
    if (!sourceElement || !cartTargetRef.current || prefersReducedMotion) {
      setBounceNonce((value) => value + 1);
      return Promise.resolve();
    }

    const nextFlight = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      imageSrc,
      source: toRect(sourceElement),
      target: toRect(cartTargetRef.current)
    };

    return new Promise<void>((resolve) => {
      resolverRef.current?.();
      resolverRef.current = resolve;
      setFlight(nextFlight);
    });
  };

  const handleFlightComplete = () => {
    setBounceNonce((value) => value + 1);
    setFlight(null);
    resolverRef.current?.();
    resolverRef.current = null;
  };

  useEffect(() => {
    return () => {
      resolverRef.current?.();
      resolverRef.current = null;
    };
  }, []);

  return (
    <CartFlightContext.Provider value={{ animateToCart, bounceNonce, registerCartTarget }}>
      {children}
      <AnimatePresence>
        {flight ? (
          <motion.div
            key={flight.id}
            className="cart-flight"
            initial={{
              opacity: 1,
              top: flight.source.top,
              left: flight.source.left,
              width: flight.source.width,
              height: flight.source.height,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0
            }}
            animate={{
              opacity: [1, 1, 0.78],
              x: [
                0,
                flight.target.left - flight.source.left,
                flight.target.left - flight.source.left
              ],
              y: [0, -40, flight.target.top - flight.source.top],
              scale: [1, 0.82, 0.24],
              rotate: [0, -6, 0]
            }}
            exit={{ opacity: 0 }}
            onAnimationComplete={handleFlightComplete}
            transition={cartFlightTransition}
          >
            <img alt="" className="cart-flight__image" src={flight.imageSrc} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </CartFlightContext.Provider>
  );
}

export function useCartFlightContext() {
  const context = useContext(CartFlightContext);

  if (!context) {
    throw new Error("useCartFlight must be used within CartFlightProvider");
  }

  return context;
}
