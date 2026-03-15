import type { EventPhase } from "@/types/event";

import { cn } from "@/lib/cn";

import { Badge } from "@/components/primitives/Badge";

const phaseMap: Record<
  EventPhase,
  {
    label: string;
    variant: "urgency" | "warning" | "success" | "live" | "neutral";
    withDot?: boolean;
  }
> = {
  PRE_SALE: { label: "Sale soon", variant: "neutral" },
  QUEUE_OPEN: { label: "Queue open", variant: "warning", withDot: true },
  QUEUE_PROCESSING: { label: "Admitting now", variant: "live", withDot: true },
  SALE_ACTIVE: { label: "Sale live", variant: "live", withDot: true },
  SALE_ENDED: { label: "Drop closed", variant: "success" }
};

interface PhaseChipProps {
  phase: EventPhase;
  className?: string;
}

export function PhaseChip({ className, phase }: PhaseChipProps) {
  const current = phaseMap[phase];

  return (
    <Badge
      className={cn("phase-chip", className)}
      size="md"
      variant={current.variant}
      withDot={current.withDot}
    >
      {current.label}
    </Badge>
  );
}

