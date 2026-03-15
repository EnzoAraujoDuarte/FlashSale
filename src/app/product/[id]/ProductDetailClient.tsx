"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";

import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { EventFooter } from "@/components/ui/EventFooter";
import { EventHeader } from "@/components/ui/EventHeader";
import { StockBadge } from "@/components/ui/StockBadge";
import { StockIndicator } from "@/components/ui/StockIndicator";
import { useCartActions } from "@/hooks/useCartActions";
import { useProductStock } from "@/hooks/useProductStock";
import { getProductCategorySummary } from "@/lib/data/products";
import { fadeInUp } from "@/lib/motion";
import { getProductSizeOptions } from "@/lib/products/sizeOptions";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const { addToCart, isAdding, lastError, status } = useCartActions();
  const { isSoldOut } = useProductStock(product.id, product.stock);
  const sizeOptions = useMemo(() => getProductSizeOptions(product), [product]);
  const availableSizes = useMemo(
    () => sizeOptions.filter((sizeOption) => !sizeOption.soldOut),
    [sizeOptions]
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (isSoldOut) {
      setSelectedSize(null);
    }
  }, [isSoldOut]);

  useEffect(() => {
    if (
      selectedSize &&
      !sizeOptions.some((sizeOption) => sizeOption.label === selectedSize && !sizeOption.soldOut)
    ) {
      setSelectedSize(null);
    }
  }, [selectedSize, sizeOptions]);

  const handleBackClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.history.length <= 1) {
      return;
    }

    event.preventDefault();
    router.back();
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      return;
    }

    await addToCart({
      product,
      size: selectedSize,
      sourceElement: mediaRef.current
    });
  };

  const buttonLabel =
    isAdding
      ? "Adding..."
      : isSoldOut || lastError === "out-of-stock"
        ? "Sold out"
        : !selectedSize
          ? "Select a size"
          : status === "success"
            ? "Added to cart"
            : status === "reserved"
              ? "Already reserved"
              : `Add ${selectedSize} to cart`;

  return (
    <div className="app-shell">
      <EventHeader />
      <motion.main animate="animate" className="phase-layout" initial="initial" variants={fadeInUp}>
        <section className="product-detail">
          <Container className="product-detail__inner">
            <motion.div className="product-detail__media-column" variants={fadeInUp}>
              <motion.div className="product-detail__media" ref={mediaRef} whileHover={{ scale: 1.02 }}>
                <div className="product-detail__image-frame">
                  <Image
                    alt={product.name}
                    className="product-detail__image"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 48vw"
                    src={product.images[0]}
                  />
                </div>
                <StockBadge
                  className="product-detail__stock-badge"
                  initialStock={product.stock}
                  productId={product.id}
                />
              </motion.div>
            </motion.div>

            <div className="product-detail__info">
              <Link className="product-detail__back" href="/" onClick={handleBackClick}>
                Back to the event
              </Link>

              <div className="product-detail__copy">
                <p className="product-detail__brand">{product.brand}</p>
                <h1 className="type-heading product-detail__title">{product.name}</h1>
                <div className="product-detail__meta">
                  <Badge size="sm" variant="neutral">
                    {product.category}
                  </Badge>
                  <Badge size="sm" variant="neutral">
                    {product.releaseWindow}
                  </Badge>
                </div>
                <p className="product-detail__summary">{getProductCategorySummary(product)}</p>
              </div>

              <div className="product-detail__pricing">
                <span className="product-detail__price">${product.price}</span>
                <span className="product-detail__original">${product.originalPrice}</span>
                <Badge className="product-detail__discount" size="sm" variant="warning">
                  {product.discount}% off
                </Badge>
              </div>

              <div className="product-detail__sizes-panel">
                <div className="product-detail__sizes-copy">
                  <p className="type-label">Select size</p>
                  <p className="type-caption product-detail__sizes-support">
                    {selectedSize
                      ? `Selected size: ${selectedSize}`
                      : `${availableSizes.length} ${
                          availableSizes.length === 1 ? "option" : "options"
                        } ready to reserve`}
                  </p>
                </div>

                <div className="product-detail__sizes">
                  {sizeOptions.map((sizeOption) => (
                    <button
                      aria-pressed={selectedSize === sizeOption.label}
                      className={`product-detail__size ${
                        selectedSize === sizeOption.label ? "product-detail__size--selected" : ""
                      } ${sizeOption.soldOut ? "product-detail__size--sold-out" : ""}`}
                      data-cursor={sizeOption.soldOut ? undefined : "go"}
                      disabled={sizeOption.soldOut}
                      key={`${product.id}-${sizeOption.label}`}
                      onClick={() => setSelectedSize(sizeOption.label)}
                      type="button"
                    >
                      {sizeOption.label}
                    </button>
                  ))}
                </div>
              </div>

              <StockIndicator initialStock={product.stock} productId={product.id} />

              <div className="product-detail__actions">
                <Button
                  disabled={!selectedSize || isSoldOut || isAdding}
                  fullWidth
                  loading={isAdding}
                  onClick={handleAddToCart}
                >
                  {buttonLabel}
                </Button>
                <p className="product-detail__note">
                  Limited to {product.maxPerUser} {product.maxPerUser === 1 ? "piece" : "pieces"}{" "}
                  per shopper. Cart reservations hold for 10 minutes.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </motion.main>
      <EventFooter />
    </div>
  );
}
