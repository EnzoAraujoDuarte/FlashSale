"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Product } from "@/types/product";

import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { CardBase } from "@/components/primitives/CardBase";
import { Body, Caption, Heading } from "@/components/primitives/Typography";
import { useCartActions } from "@/hooks/useCartActions";
import { useProductStock } from "@/hooks/useProductStock";
import { cartThumbnailLift, staggerItem } from "@/lib/motion";
import { getProductSizeOptions } from "@/lib/products/sizeOptions";
import { useCartStore } from "@/stores/useCartStore";

import { StockBadge } from "./StockBadge";
import { StockIndicator } from "./StockIndicator";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const productHref = `/product/${product.id}`;
  const cartQuantity = useCartStore((state) =>
    state.items
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0)
  );
  const { isSoldOut } = useProductStock(product.id, product.stock);
  const { addToCart, isAdding, lastError, status } = useCartActions();
  const sizeOptions = useMemo(() => getProductSizeOptions(product), [product]);
  const availableSizes = useMemo(
    () => sizeOptions.filter((sizeOption) => !sizeOption.soldOut),
    [sizeOptions]
  );
  const [isSizePickerOpen, setIsSizePickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!isSizePickerOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) {
        setIsSizePickerOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSizePickerOpen]);

  useEffect(() => {
    if (isSoldOut) {
      setIsSizePickerOpen(false);
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

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setIsSizePickerOpen(true);
      return;
    }

    const result = await addToCart({
      product,
      size: selectedSize,
      sourceElement: mediaRef.current
    });

    if (result === "success" || result === "already-in-cart") {
      setIsSizePickerOpen(false);
    }
  };

  const buttonLabel =
    isAdding
      ? "Adding..."
      : isSoldOut || lastError === "out-of-stock"
        ? "Sold out"
        : !selectedSize
          ? isSizePickerOpen
            ? "Choose a size"
            : "Add to cart"
        : status === "success"
          ? "Added"
          : status === "reserved"
            ? "Reserved"
            : `Add ${selectedSize}`;

  const buttonVariant =
    isSoldOut || lastError === "out-of-stock"
      ? "danger"
      : status === "success"
        ? "success"
        : status === "reserved"
          ? "ghost"
          : "primary";

  return (
    <motion.div layout ref={cardRef} variants={staggerItem}>
      <CardBase
        className={`product-card ${isSoldOut ? "product-card--sold-out" : ""}`}
        data-cursor={isSoldOut ? undefined : "view"}
      >
        <Link
          aria-label={`View details for ${product.name}`}
          className="product-card__media-link"
          data-cursor="view"
          href={productHref}
        >
          <motion.div
            animate={status === "success" ? "animate" : "initial"}
            className="product-card__media"
            ref={mediaRef}
            variants={cartThumbnailLift}
          >
            <div className="product-card__image-wrap">
              <Image
                alt={product.name}
                className="product-card__image"
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
                src={product.images[0]}
              />
            </div>
            <div className="product-card__overlay-top">
              <Badge size="sm" variant="neutral">
                {product.releaseWindow}
              </Badge>
              {cartQuantity > 0 ? (
                <Badge size="sm" variant="success">
                  In cart
                </Badge>
              ) : null}
            </div>
            <StockBadge
              className="product-card__stock-badge"
              initialStock={product.stock}
              productId={product.id}
            />
            {isSoldOut ? <div className="product-card__sold-out-veil" /> : null}
          </motion.div>
        </Link>

        <motion.div className="product-card__body" layout>
          <div className="product-card__copy">
            <Caption>{product.brand}</Caption>
            <Heading as="h3" className="product-card__title">
              <Link className="product-card__title-link" href={productHref}>
                {product.name}
              </Link>
            </Heading>
            <Body className="product-card__description">{product.category}</Body>
          </div>

          <div className="product-card__pricing">
            <div className="product-card__price-row">
              <span className="product-card__price">${product.price}</span>
              <span className="product-card__original">${product.originalPrice}</span>
            </div>
            <Badge size="sm" variant="warning">
              {product.discount}% off
            </Badge>
          </div>

          <button
            className="product-card__selection"
            data-cursor="go"
            onClick={() => setIsSizePickerOpen((state) => !state)}
            type="button"
          >
            <span className="product-card__selection-label">
              {selectedSize
                ? `Selected size: ${selectedSize}`
                : `${availableSizes.length} ${
                    availableSizes.length === 1 ? "size" : "sizes"
                  } ready to reserve`}
            </span>
            <span className="product-card__selection-support">
              {selectedSize ? "Tap add to reserve instantly." : "Pick a size to continue."}
            </span>
          </button>

          <StockIndicator initialStock={product.stock} productId={product.id} />

          <Button
            disabled={isSoldOut || isAdding}
            fullWidth
            loading={isAdding}
            onClick={handleAddToCart}
            cursor="go"
            variant={buttonVariant}
          >
            {buttonLabel}
          </Button>

          <AnimatePresence initial={false}>
            {isSizePickerOpen ? (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className="product-card__size-picker-wrap"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
              >
                <div className="product-card__size-picker">
                  {sizeOptions.map((sizeOption) => (
                    <button
                      className={`product-card__size ${
                        selectedSize === sizeOption.label ? "product-card__size--selected" : ""
                      } ${sizeOption.soldOut ? "product-card__size--sold-out" : ""}`}
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
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </CardBase>
    </motion.div>
  );
}
