"use client";

import { useEffect, useMemo } from "react";

import { createEventMock } from "@/mocks/event";
import { stockSimulator } from "@/lib/simulators/stockSimulator";
import { useStockStore } from "@/stores/useStockStore";
import type { Product } from "@/types/product";

import { SaleCollection } from "../sections/SaleCollection";
import { EventTicker } from "./EventTicker";
import { EventFooter } from "./EventFooter";
import { EventHeader } from "./EventHeader";

interface DirectSalePageProps {
  initialProducts: Product[];
}

export function DirectSalePage({ initialProducts }: DirectSalePageProps) {
  const liveEvent = useMemo(
    () =>
      createEventMock({
      phase: "SALE_ACTIVE" as const,
      saleStartsAt: new Date(Date.now() - 23 * 60 * 1000)
      }),
    []
  );

  useEffect(() => {
    useStockStore.getState().initStock(initialProducts);
    stockSimulator.start(initialProducts);

    return () => {
      stockSimulator.stop();
    };
  }, [initialProducts]);

  const piecesRemaining = useMemo(
    () => initialProducts.reduce((total, product) => total + product.stock, 0),
    [initialProducts]
  );

  return (
    <div className="app-shell">
      <EventHeader phaseOverride="SALE_ACTIVE" />
      <EventTicker fallbackPiecesRemaining={piecesRemaining} />
      <main className="phase-layout">
        <SaleCollection event={liveEvent} products={initialProducts} />
      </main>
      <EventFooter />
    </div>
  );
}
