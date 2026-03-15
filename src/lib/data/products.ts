import { productsMock } from "@/mocks/products";
import type { Product, ProductAvailability } from "@/types/product";

interface FakeStoreApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate?: number;
    count?: number;
  };
}

export const CATALOG_REVALIDATE_SECONDS = 60 * 30;

const FAKE_STORE_PRODUCTS_ENDPOINT =
  process.env.FAKE_STORE_API_URL ?? "https://fakestoreapi.com/products?limit=8";
let cachedCatalogProducts: Product[] | null = null;

const SCARCITY_PROFILE = [12, 10, 8, 6, 5, 4, 3, 2];
const RELEASE_WINDOWS = [
  "Unlocks at launch",
  "Unlocks at launch",
  "Unlocks at launch",
  "Second batch",
  "Second batch",
  "Third batch",
  "Final batch",
  "Archive reserve"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function resolveSizes(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("men") || normalizedCategory.includes("women")) {
    return ["S", "M", "L", "XL"];
  }

  if (normalizedCategory.includes("jewel")) {
    return ["One Size"];
  }

  if (normalizedCategory.includes("electronic")) {
    return ["Standard", "Bundle"];
  }

  return ["One Size"];
}

function resolveBrand(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("electronic")) {
    return "FakeStore Tech";
  }

  if (normalizedCategory.includes("jewel")) {
    return "FakeStore Atelier";
  }

  return "FakeStore Studio";
}

function resolveAvailability(stock: number): ProductAvailability {
  if (stock <= 0) {
    return "sold-out";
  }

  if (stock <= 4) {
    return "limited";
  }

  if (stock <= 7) {
    return "selling-fast";
  }

  return "preview";
}

function resolveBadge(stock: number, isFeatured: boolean, category: string) {
  if (stock <= 0) {
    return "Sold out";
  }

  if (stock <= 2) {
    return "Critical stock";
  }

  if (stock <= 4) {
    return "Low stock";
  }

  if (isFeatured) {
    return "Top pick";
  }

  if (category.toLowerCase().includes("electronic")) {
    return "Fast mover";
  }

  return "Curated drop";
}

function mapFakeStoreProduct(product: FakeStoreApiProduct, index: number): Product {
  const price = Math.max(24, Math.round(product.price));
  const discount = Math.min(48, Math.max(18, 22 + index * 3));
  const originalPrice = Math.round(price / (1 - discount / 100));
  const stock = SCARCITY_PROFILE[index % SCARCITY_PROFILE.length];
  const category = titleCase(product.category);
  const isFeatured = index < 3 || (product.rating?.rate ?? 0) >= 4.5;

  return {
    id: `fake-store-${product.id}`,
    slug: slugify(product.title),
    name: product.title,
    brand: resolveBrand(product.category),
    category,
    description: product.description,
    price,
    originalPrice,
    discount,
    stock,
    maxPerUser: category === "Electronics" || category === "Jewelery" ? 1 : 2,
    images: [product.image],
    sizes: resolveSizes(product.category),
    isFeatured,
    releaseWindow: RELEASE_WINDOWS[index % RELEASE_WINDOWS.length],
    badge: resolveBadge(stock, isFeatured, product.category),
    availability: resolveAvailability(stock)
  };
}

export async function getCatalogProducts() {
  try {
    const response = await fetch(FAKE_STORE_PRODUCTS_ENDPOINT, {
      headers: {
        accept: "application/json"
      },
      next: {
        revalidate: CATALOG_REVALIDATE_SECONDS
      }
    });

    if (!response.ok) {
      throw new Error(`FakeStore API responded with ${response.status}`);
    }

    const payload = (await response.json()) as FakeStoreApiProduct[];

    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error("FakeStore API returned an empty catalog");
    }

    const catalogProducts = payload.slice(0, 8).map(mapFakeStoreProduct);

    cachedCatalogProducts = catalogProducts;

    return catalogProducts;
  } catch (error) {
    console.error("[catalog] Failed to load FakeStore catalog.", {
      endpoint: FAKE_STORE_PRODUCTS_ENDPOINT,
      error: error instanceof Error ? error.message : "Unknown error"
    });

    return cachedCatalogProducts ?? productsMock;
  }
}

export async function getCatalogProductById(id: string) {
  const catalogProducts = await getCatalogProducts();

  return catalogProducts.find((product) => product.id === id);
}

export function getProductCategorySummary(product: Product) {
  const normalizedCategory = product.category.toLowerCase();

  if (normalizedCategory.includes("electronic")) {
    return "A high-velocity tech essential positioned for the earliest sell-through window.";
  }

  if (normalizedCategory.includes("jewel")) {
    return "A polished statement piece curated to disappear fast once the drop goes live.";
  }

  if (normalizedCategory.includes("men")) {
    return "A limited menswear staple built for repeat rotation during the fastest wave of the release.";
  }

  if (normalizedCategory.includes("women")) {
    return "A sharp womenswear silhouette tuned for headline energy and quick sell-outs.";
  }

  if (normalizedCategory.includes("outerwear")) {
    return "A weather-ready layer designed to anchor the collection with immediate impact.";
  }

  if (normalizedCategory.includes("bottom")) {
    return "A structured bottom built to balance function, comfort, and fast-moving demand.";
  }

  if (normalizedCategory.includes("fleece") || normalizedCategory.includes("knit")) {
    return "A textured layering piece made to add warmth and depth to the core drop.";
  }

  if (normalizedCategory.includes("top")) {
    return "A clean top-layer essential that keeps the release versatile and easy to style.";
  }

  if (normalizedCategory.includes("accessor")) {
    return "A compact finishing piece that sharpens the look without slowing the pace.";
  }

  if (normalizedCategory.includes("footwear")) {
    return "A limited footwear hit engineered to pull attention the second access opens.";
  }

  return "A limited-release essential curated to feel premium from preview to final checkout.";
}
