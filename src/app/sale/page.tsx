import { DirectSalePage } from "@/components/ui/DirectSalePage";
import { CATALOG_REVALIDATE_SECONDS, getCatalogProducts } from "@/lib/data/products";

export const revalidate = CATALOG_REVALIDATE_SECONDS;

export default async function SalePage() {
  const initialProducts = await getCatalogProducts();

  return <DirectSalePage initialProducts={initialProducts} />;
}
