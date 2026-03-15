import { cn } from "@/lib/cn";

import { Body, Heading, Label } from "./Typography";

interface TitleBlockProps {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  className?: string;
}

export function TitleBlock({
  align = "left",
  className,
  copy,
  eyebrow,
  title
}: TitleBlockProps) {
  return (
    <div className={cn("title-block", align === "center" && "title-block--center", className)}>
      <Label>{eyebrow}</Label>
      <Heading>{title}</Heading>
      {copy ? <Body>{copy}</Body> : null}
    </div>
  );
}

