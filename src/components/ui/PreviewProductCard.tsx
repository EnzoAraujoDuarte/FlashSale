import Image from "next/image";

import type { Product } from "@/types/product";

import { Badge } from "@/components/primitives/Badge";
import { CardBase } from "@/components/primitives/CardBase";
import { Caption, Heading } from "@/components/primitives/Typography";

interface PreviewProductCardProps {
  product: Product;
}

export function PreviewProductCard({ product }: PreviewProductCardProps) {
  return (
    <CardBase className="preview-card">
      <div className="preview-card__media">
        <Image
          alt={product.name}
          className="preview-card__image"
          fill
          sizes="(max-width: 767px) 100vw, 25vw"
          src={product.images[0]}
        />
        <div className="preview-card__veil" />
        <div className="preview-card__overlay">
          <Badge size="sm" variant="neutral">
            {product.releaseWindow}
          </Badge>
        </div>
      </div>
      <div className="preview-card__body">
        <Caption>{product.category}</Caption>
        <Heading as="h3" className="preview-card__title">
          {product.name}
        </Heading>
      </div>
    </CardBase>
  );
}

