import { notFound } from "next/navigation";

import { CATALOG_REVALIDATE_SECONDS, getCatalogProductById } from "@/lib/data/products";

import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = CATALOG_REVALIDATE_SECONDS;

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getCatalogProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
