import { PhaseRouter } from "@/components/ui/PhaseRouter";
import { getCatalogProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function EventPage() {
  const initialProducts = await getCatalogProducts();

  return <PhaseRouter initialProducts={initialProducts} />;
}
