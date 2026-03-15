import { CardBase } from "@/components/primitives/CardBase";

export function ProductCardSkeleton() {
  return (
    <CardBase className="product-card-skeleton" aria-hidden="true">
      <div className="product-card-skeleton__media shimmer-block" />
      <div className="product-card-skeleton__body">
        <span className="product-card-skeleton__line product-card-skeleton__line--sm shimmer-block" />
        <span className="product-card-skeleton__line product-card-skeleton__line--lg shimmer-block" />
        <span className="product-card-skeleton__line product-card-skeleton__line--md shimmer-block" />
        <span className="product-card-skeleton__line product-card-skeleton__line--price shimmer-block" />
        <span className="product-card-skeleton__cta shimmer-block" />
      </div>
    </CardBase>
  );
}
