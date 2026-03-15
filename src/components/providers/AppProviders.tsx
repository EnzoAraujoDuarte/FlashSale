"use client";

import type { ReactNode } from "react";

import { CartDrawer } from "@/components/ui/CartDrawer";
import { CustomCursor } from "@/components/ui/CustomCursor";

import { CartExpiryMonitor } from "./CartExpiryMonitor";
import { CartFlightProvider } from "./CartFlightProvider";
import { ToastProvider } from "./ToastProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <CartFlightProvider>
        <CartExpiryMonitor />
        <CustomCursor />
        {children}
        <CartDrawer />
      </CartFlightProvider>
    </ToastProvider>
  );
}
