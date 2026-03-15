import { create } from "zustand";

import type { Product } from "@/types/product";
import type { StockLevel } from "@/types/stock";

function buildStockState(products: Product[]) {
  const stockMap = Object.fromEntries(products.map((product) => [product.id, product.stock]));

  return {
    stockMap,
    soldOut: Object.fromEntries(
      Object.entries(stockMap).map(([productId, quantity]) => [productId, quantity <= 0])
    ),
    lastUpdated: Object.fromEntries(products.map((product) => [product.id, 0]))
  };
}

interface StockStore {
  stockMap: Record<string, number>;
  soldOut: Record<string, boolean>;
  lastUpdated: Record<string, number>;
  initStock: (products?: Product[]) => void;
  decrementStock: (productId: string, amount?: number) => void;
  incrementStock: (productId: string, amount?: number) => void;
  setStock: (productId: string, quantity: number) => void;
  markSoldOut: (productId: string) => void;
  getStockLevel: (productId: string) => StockLevel;
  resetStock: () => void;
}

const initialStockState = buildStockState([]);

export function resolveStockLevel(quantity: number): StockLevel {
  if (quantity <= 0) {
    return "sold-out";
  }

  if (quantity < 5) {
    return "critical";
  }

  if (quantity < 10) {
    return "low";
  }

  return "normal";
}

export const useStockStore = create<StockStore>((set, get) => ({
  ...initialStockState,
  initStock: (products = []) => set(buildStockState(products)),
  decrementStock: (productId, amount = 1) =>
    set((state) => {
      const currentStock = state.stockMap[productId] ?? 0;
      const nextStock = Math.max(0, currentStock - amount);
      const nextTimestamp = nextStock === currentStock ? state.lastUpdated[productId] : Date.now();

      return {
        stockMap: {
          ...state.stockMap,
          [productId]: nextStock
        },
        soldOut: {
          ...state.soldOut,
          [productId]: nextStock <= 0
        },
        lastUpdated: {
          ...state.lastUpdated,
          [productId]: nextTimestamp
        }
      };
    }),
  incrementStock: (productId, amount = 1) =>
    set((state) => {
      const nextStock = Math.max(0, (state.stockMap[productId] ?? 0) + amount);

      return {
        stockMap: {
          ...state.stockMap,
          [productId]: nextStock
        },
        soldOut: {
          ...state.soldOut,
          [productId]: nextStock <= 0
        },
        lastUpdated: {
          ...state.lastUpdated,
          [productId]: Date.now()
        }
      };
    }),
  setStock: (productId, quantity) =>
    set((state) => ({
      stockMap: {
        ...state.stockMap,
        [productId]: Math.max(0, quantity)
      },
      soldOut: {
        ...state.soldOut,
        [productId]: quantity <= 0
      },
      lastUpdated: {
        ...state.lastUpdated,
        [productId]: Date.now()
      }
    })),
  markSoldOut: (productId) =>
    set((state) => ({
      stockMap: {
        ...state.stockMap,
        [productId]: 0
      },
      soldOut: {
        ...state.soldOut,
        [productId]: true
      },
      lastUpdated: {
        ...state.lastUpdated,
        [productId]: Date.now()
      }
    })),
  getStockLevel: (productId) => resolveStockLevel(get().stockMap[productId] ?? 0),
  resetStock: () => set(initialStockState)
}));
