export type ProductAvailability =
  | "preview"
  | "limited"
  | "selling-fast"
  | "sold-out";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  maxPerUser: number;
  images: string[];
  sizes: string[];
  isFeatured: boolean;
  releaseWindow: string;
  badge: string;
  availability: ProductAvailability;
}

