"use client";

import type { FlashEvent } from "@/types/event";
import type { Product } from "@/types/product";

import { Badge } from "@/components/primitives/Badge";
import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { Body } from "@/components/primitives/Typography";
import { useStockStore } from "@/stores/useStockStore";

import { CountdownCompact } from "../ui/CountdownCompact";
import { ProductGrid } from "../ui/ProductGrid";

interface SaleCollectionProps {
  event: FlashEvent;
  products: Product[];
}

export function SaleCollection({ event, products }: SaleCollectionProps) {
  const saleEndsAt = new Date(event.saleStartsAt.getTime() + event.saleDuration * 60 * 1000);
  const fallbackPiecesRemaining = products.reduce((total, product) => total + product.stock, 0);
  const piecesRemaining = useStockStore((state) =>
    Object.keys(state.stockMap).length
      ? Object.values(state.stockMap).reduce((total, quantity) => total + quantity, 0)
      : fallbackPiecesRemaining
  );

  return (
    <Section className="sale-collection" id="sale-live">
      <div className="sale-collection__header">
        <div className="sale-collection__copy">
          <TitleBlock
            copy="The live grid is updating with dynamic stock pressure, fast reservation feedback, and a layout tuned for high-speed scanning."
            eyebrow="Live collection"
            title="Sale is live."
          />
          <Body className="sale-collection__support">
            Every product is moving in real time. Featured styles burn down first, sold-out items fall away, and scarcity stays legible without noise.
          </Body>
        </div>

        <div className="sale-collection__meta">
          <Badge variant="live" withDot>
            {piecesRemaining} tracked pieces remaining
          </Badge>
          <CountdownCompact label="Sale closes in" targetDate={saleEndsAt} />
        </div>
      </div>

      <ProductGrid products={products} />
    </Section>
  );
}
