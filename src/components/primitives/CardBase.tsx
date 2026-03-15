import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function CardBase({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-base", className)} {...props} />;
}
