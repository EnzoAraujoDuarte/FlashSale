"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { useEventLifecycle } from "@/hooks/useEventLifecycle";
import { fadeIn } from "@/lib/motion";
import { useEventStore } from "@/stores/useEventStore";
import { useQueueStore } from "@/stores/useQueueStore";
import type { Product } from "@/types/product";

import { Button } from "../primitives/Button";
import { EventBrand } from "../sections/EventBrand";
import { EventHero } from "../sections/EventHero";
import { EventIntro } from "../sections/EventIntro";
import { FinalCTA } from "../sections/FinalCTA";
import { PreviewSection } from "../sections/PreviewSection";
import { SaleCollection } from "../sections/SaleCollection";
import { ScarcitySection } from "../sections/ScarcitySection";
import { DemoBanner } from "./DemoBanner";
import { EventTicker } from "./EventTicker";
import { EventFooter } from "./EventFooter";
import { EventHeader } from "./EventHeader";
import { DemoController } from "./DemoController";
import { ProductsModal } from "./ProductsModal";
import { QueueAdmitted } from "./QueueAdmitted";
import { QueueLineIntro } from "./QueueLineIntro";
import { QueueStatus } from "./QueueStatus";
import { SaleEndedScreen } from "./SaleEndedScreen";

interface PhaseRouterProps {
  initialProducts: Product[];
}

export function PhaseRouter({ initialProducts }: PhaseRouterProps) {
  useEventLifecycle(initialProducts);

  const event = useEventStore((state) => state.event);
  const phase = useEventStore((state) => state.phase);
  const queueStatus = useQueueStore((state) => state.status);
  const [showQueueIntro, setShowQueueIntro] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const previewProducts = useMemo(() => initialProducts.slice(0, 4), [initialProducts]);
  const piecesRemaining = useMemo(
    () => initialProducts.reduce((total, product) => total + product.stock, 0),
    [initialProducts]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  useEffect(() => {
    if (phase === "SALE_ACTIVE") {
      setIsProductsModalOpen(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "QUEUE_OPEN") {
      setShowQueueIntro(false);
      return;
    }

    setShowQueueIntro(true);

    const timeoutId = window.setTimeout(() => {
      setShowQueueIntro(false);
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [phase]);

  return (
    <div className="app-shell" id="event-top">
      <DemoBanner />
      <EventHeader />
      {phase === "SALE_ACTIVE" ? <EventTicker fallbackPiecesRemaining={piecesRemaining} /> : null}

      <AnimatePresence mode="wait">
        <motion.main
          animate="animate"
          className="phase-layout"
          exit="exit"
          initial="initial"
          key={phase}
          variants={fadeIn}
        >
          {phase === "PRE_SALE" ? (
            <>
              <EventHero event={event} />
              <EventIntro event={event} />
              <EventBrand event={event} />
              <PreviewSection event={event} products={previewProducts} />
              <ScarcitySection event={event} />
              <FinalCTA />
            </>
          ) : null}

          {phase === "QUEUE_OPEN"
            ? showQueueIntro
              ? <QueueLineIntro />
              : <QueueStatus phase="QUEUE_OPEN" />
            : null}

          {phase === "QUEUE_PROCESSING"
            ? queueStatus === "admitted"
              ? <QueueAdmitted />
              : <QueueStatus phase="QUEUE_PROCESSING" />
            : null}

          {phase === "SALE_ACTIVE" ? (
            <SaleCollection event={event} products={initialProducts} />
          ) : null}

          {phase === "SALE_ENDED" ? <SaleEndedScreen collectionTag={event.collectionTag} /> : null}
        </motion.main>
      </AnimatePresence>

      <EventFooter />
      {phase !== "SALE_ACTIVE" ? (
        <div className="products-fab">
          <Button cursor="go" onClick={() => setIsProductsModalOpen(true)} variant="primary">
            View Products
          </Button>
        </div>
      ) : null}
      <ProductsModal
        isOpen={isProductsModalOpen}
        onClose={() => setIsProductsModalOpen(false)}
        products={initialProducts}
      />
      <DemoController />
    </div>
  );
}
