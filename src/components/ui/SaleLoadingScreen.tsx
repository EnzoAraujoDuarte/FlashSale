import type { EventPhase } from "@/types/event";

import { Badge } from "@/components/primitives/Badge";
import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";

import { EventFooter } from "./EventFooter";
import { EventHeader } from "./EventHeader";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

interface SaleLoadingScreenProps {
  phase?: EventPhase;
}

export function SaleLoadingScreen({ phase = "SALE_ACTIVE" }: SaleLoadingScreenProps) {
  return (
    <div className="app-shell">
      <EventHeader phaseOverride={phase} />
      <main className="phase-layout">
        <Section className="sale-loading" id="sale-live">
          <div className="container">
            <div className="sale-loading__header">
              <div className="sale-loading__copy">
                <TitleBlock
                  copy="The catalog is loading with live inventory pressure, premium product cards, and the next reservation opportunities."
                  eyebrow="Loading drop"
                  title="The collection is taking the stage."
                />
              </div>
              <div className="sale-loading__meta">
                <Badge variant="neutral">Preparing products</Badge>
              </div>
            </div>
            <ProductGridSkeleton />
          </div>
        </Section>
      </main>
      <EventFooter />
    </div>
  );
}
