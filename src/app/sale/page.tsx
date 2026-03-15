import { DirectSalePage } from "@/components/ui/DirectSalePage";
import { getCatalogProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function SalePage() {
  const initialProducts = await getCatalogProducts();

  return <DirectSalePage initialProducts={initialProducts} />;
}
