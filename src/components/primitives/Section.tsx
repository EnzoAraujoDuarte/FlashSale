import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./Container";

type SectionTone = "default" | "surface" | "highlight";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
}

export function Section({
  className,
  children,
  tone = "default",
  ...props
}: SectionProps) {
  return (
    <section className={cn("section", tone !== "default" && `section--${tone}`, className)} {...props}>
      <Container className="section__inner">{children}</Container>
    </section>
  );
}

