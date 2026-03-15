"use client";

import { useCartFlightContext } from "@/components/providers/CartFlightProvider";

export function useCartFlight() {
  return useCartFlightContext();
}
