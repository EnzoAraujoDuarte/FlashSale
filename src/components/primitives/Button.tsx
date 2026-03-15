import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "danger" | "success";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  cursor?: "go";
}

export function Button({
  children,
  className,
  disabled,
  fullWidth = false,
  loading = false,
  size = "md",
  type = "button",
  variant = "primary",
  cursor,
  ...props
}: ButtonProps) {
  const resolvedCursor = cursor ?? (variant === "primary" || variant === "success" ? "go" : undefined);

  return (
    <button
      className={cn(
        "button",
        `button--${variant}`,
        `button--${size}`,
        fullWidth && "button--full",
        loading && "is-loading",
        className
      )}
      data-loading={loading}
      data-cursor={!disabled && !loading ? resolvedCursor : undefined}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      <span className="button__content">{children}</span>
    </button>
  );
}
