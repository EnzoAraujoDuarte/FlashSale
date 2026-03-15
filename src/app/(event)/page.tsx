import { PhaseRouter } from "@/components/ui/PhaseRouter";
import { CATALOG_REVALIDATE_SECONDS, getCatalogProducts } from "@/lib/data/products";

export const revalidate = CATALOG_REVALIDATE_SECONDS;

export default async function EventPage() {
  const initialProducts = await getCatalogProducts();

  return <PhaseRouter initialProducts={initialProducts} />;
}
