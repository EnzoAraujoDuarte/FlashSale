import { create } from "zustand";

import type { Cart, CartAddResult, CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

import { useStockStore } from "./useStockStore";

interface CartStore extends Cart {
  addItem: (product: Product, size: string) => CartAddResult;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  extendReservation: (extraMs?: number) => void;
  initExpiry: () => void;
}

const DEFAULT_RESERVATION_DURATION = 10 * 60 * 1000;

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);

  return {
    total,
    originalTotal,
    savings: Math.max(0, originalTotal - total)
  };
}

function createExpiryDate(duration = DEFAULT_RESERVATION_DURATION) {
  return new Date(Date.now() + duration);
}

function toCartItem(product: Product, size: string): CartItem {
  return {
    productId: product.id,
    brand: product.brand,
    name: product.name,
    thumbnail: product.images[0],
    size,
    quantity: 1,
    price: product.price,
    originalPrice: product.originalPrice
  };
}

function restoreReservedStock(items: CartItem[]) {
  const stockStore = useStockStore.getState();

  items.forEach((item) => {
    stockStore.incrementStock(item.productId, item.quantity);
  });
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  expiresAt: null,
  reservationDuration: DEFAULT_RESERVATION_DURATION,
  total: 0,
  originalTotal: 0,
  savings: 0,
  addItem: (product, size) => {
    let result: CartAddResult = "success";

    set((state) => {
      const stockStore = useStockStore.getState();
      const availableStock = stockStore.stockMap[product.id] ?? product.stock;
      const alreadyInCart = state.items.some(
        (item) => item.productId === product.id && item.size === size
      );

      if (availableStock <= 0) {
        result = "out-of-stock";
        return state;
      }

      if (alreadyInCart) {
        result = "already-in-cart";
        return state;
      }

      stockStore.decrementStock(product.id);

      const items = [toCartItem(product, size), ...state.items];

      return {
        items,
        expiresAt: state.expiresAt ?? createExpiryDate(state.reservationDuration),
        ...calculateTotals(items)
      };
    });

    return result;
  },
  removeItem: (productId, size) =>
    set((state) => {
      const removedItem = state.items.find(
        (entry) => entry.productId === productId && entry.size === size
      );

      if (!removedItem) {
        return state;
      }

      useStockStore.getState().incrementStock(removedItem.productId, removedItem.quantity);

      const items = state.items.filter(
        (entry) => !(entry.productId === productId && entry.size === size)
      );

      return {
        items,
        expiresAt: items.length ? state.expiresAt : null,
        ...calculateTotals(items)
      };
    }),
  clearCart: () =>
    set((state) => {
      restoreReservedStock(state.items);

      return {
        items: [],
        expiresAt: null,
        total: 0,
        originalTotal: 0,
        savings: 0
      };
    }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  extendReservation: (extraMs = 60_000) =>
    set((state) => {
      if (!state.items.length) {
        return state;
      }

      return {
        expiresAt: new Date(
          Math.max(state.expiresAt?.getTime() ?? Date.now(), Date.now()) + extraMs
        )
      };
    }),
  initExpiry: () =>
    set((state) => {
      if (!state.items.length || state.expiresAt) {
        return state;
      }

      return {
        expiresAt: createExpiryDate(state.reservationDuration)
      };
    })
}));
