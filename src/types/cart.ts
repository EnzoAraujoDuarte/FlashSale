export interface CartItem {
  productId: string;
  brand: string;
  name: string;
  thumbnail: string;
  size: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

export interface Cart {
  items: CartItem[];
  isOpen: boolean;
  expiresAt: Date | null;
  reservationDuration: number;
  total: number;
  originalTotal: number;
  savings: number;
}

export type CartAddResult = "success" | "out-of-stock" | "already-in-cart";
