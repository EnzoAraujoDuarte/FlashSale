import type { Product } from "@/types/product";

export interface ProductSizeOption {
  label: string;
  soldOut: boolean;
}

function hashValue(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function getProductSizeOptions(product: Product): ProductSizeOption[] {
  if (product.sizes.length <= 1) {
    return product.sizes.map((label) => ({ label, soldOut: false }));
  }

  const soldOutCount =
    product.stock <= 3
      ? Math.min(product.sizes.length - 1, 2)
      : product.stock <= 6
        ? 1
        : 0;
  const seed = hashValue(product.id);
  const soldOutIndexes = new Set<number>();

  for (let index = 0; index < soldOutCount; index += 1) {
    soldOutIndexes.add((seed + index * 2) % product.sizes.length);
  }

  return product.sizes.map((label, index) => ({
    label,
    soldOut: soldOutIndexes.has(index)
  }));
}
