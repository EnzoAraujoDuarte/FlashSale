import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

function Typography({
  as,
  children,
  className,
  baseClass,
  ...props
}: TypographyProps & { baseClass: string }) {
  const Component = as ?? "p";

  return (
    <Component className={cn(baseClass, className)} {...props}>
      {children}
    </Component>
  );
}

export function Display(props: TypographyProps) {
  return <Typography as={props.as ?? "h1"} baseClass="type-display" {...props} />;
}

export function Heading(props: TypographyProps) {
  return <Typography as={props.as ?? "h2"} baseClass="type-heading" {...props} />;
}

export function Subheading(props: TypographyProps) {
  return <Typography as={props.as ?? "p"} baseClass="type-subheading" {...props} />;
}

export function Body(props: TypographyProps) {
  return <Typography as={props.as ?? "p"} baseClass="type-body" {...props} />;
}

export function Caption(props: TypographyProps) {
  return <Typography as={props.as ?? "p"} baseClass="type-caption" {...props} />;
}

export function Label(props: TypographyProps) {
  return <Typography as={props.as ?? "p"} baseClass="type-label" {...props} />;
}

