import { Container } from "@/components/primitives/Container";
import { EventFooter } from "@/components/ui/EventFooter";
import { EventHeader } from "@/components/ui/EventHeader";

export default function ProductDetailLoading() {
  return (
    <div className="app-shell">
      <EventHeader />
      <main className="phase-layout">
        <section className="product-detail">
          <Container className="product-detail__inner">
            <div className="product-detail-loading__media shimmer-block" />
            <div className="product-detail-loading__info">
              <span className="product-detail-loading__line product-detail-loading__line--eyebrow shimmer-block" />
              <span className="product-detail-loading__line product-detail-loading__line--title shimmer-block" />
              <span className="product-detail-loading__line product-detail-loading__line--summary shimmer-block" />
              <div className="product-detail-loading__pricing shimmer-block" />
              <div className="product-detail-loading__sizes">
                <span className="product-detail-loading__size shimmer-block" />
                <span className="product-detail-loading__size shimmer-block" />
                <span className="product-detail-loading__size shimmer-block" />
                <span className="product-detail-loading__size shimmer-block" />
              </div>
              <div className="product-detail-loading__stock shimmer-block" />
              <div className="product-detail-loading__button shimmer-block" />
            </div>
          </Container>
        </section>
      </main>
      <EventFooter />
    </div>
  );
}
