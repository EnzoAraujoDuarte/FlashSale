"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import type { Product } from "@/types/product";

import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { fadeIn, fadeInUp } from "@/lib/motion";

import { ProductGrid } from "./ProductGrid";

interface ProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export function ProductsModal({ isOpen, onClose, products }: ProductsModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useScrollLock(isOpen);
  useFocusTrap({
    active: isOpen,
    containerRef: dialogRef,
    onEscape: onClose
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate="animate"
          className="products-modal"
          exit="exit"
          initial="initial"
          variants={fadeIn}
        >
          <motion.div
            animate="animate"
            aria-describedby="products-modal-description"
            aria-labelledby="products-modal-title"
            aria-modal="true"
            className="products-modal__panel"
            exit="exit"
            initial="initial"
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
            variants={fadeInUp}
          >
            <div className="products-modal__header">
              <Container className="products-modal__header-inner">
                <div className="products-modal__copy">
                  <p className="type-label">Full Catalog</p>
                  <h2 className="type-heading products-modal__title" id="products-modal-title">
                    Browse the full drop whenever you want.
                  </h2>
                  <p className="type-body products-modal__support" id="products-modal-description">
                    Every piece stays visible here, so the catalog is always one tap away.
                  </p>
                </div>
                <Button aria-label="Close products modal" onClick={onClose} variant="ghost">
                  Close
                </Button>
              </Container>
            </div>

            <div className="products-modal__body">
              <Container className="products-modal__body-inner">
                <ProductGrid products={products} />
              </Container>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
