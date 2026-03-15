import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "urgency" | "warning" | "success" | "live" | "neutral";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  withDot?: boolean;
}

export function Badge({
  children,
  className,
  size = "md",
  variant = "neutral",
  withDot = false,
  ...props
}: BadgeProps) {
  return (
    <span className={cn("badge", `badge--${variant}`, `badge--${size}`, className)} {...props}>
      {withDot ? <span className="badge__dot" aria-hidden="true" /> : null}
      <span>{children}</span>
    </span>
  );
}

