"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import type { Product } from "@/types/product";

import { staggerContainer } from "@/lib/motion";
import { useStockStore } from "@/stores/useStockStore";

import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const stockMap = useStockStore((state) => state.stockMap);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((left, right) => {
        const leftStock = stockMap[left.id] ?? left.stock;
        const rightStock = stockMap[right.id] ?? right.stock;
        const leftSoldOut = leftStock <= 0;
        const rightSoldOut = rightStock <= 0;

        if (leftSoldOut !== rightSoldOut) {
          return leftSoldOut ? 1 : -1;
        }

        if (left.isFeatured !== right.isFeatured) {
          return left.isFeatured ? -1 : 1;
        }

        return leftStock - rightStock;
      }),
    [products, stockMap]
  );

  return (
    <motion.div className="product-grid" initial="initial" animate="animate" variants={staggerContainer}>
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}

