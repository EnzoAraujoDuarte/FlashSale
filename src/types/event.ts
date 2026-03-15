export type EventPhase =
  | "PRE_SALE"
  | "QUEUE_OPEN"
  | "QUEUE_PROCESSING"
  | "SALE_ACTIVE"
  | "SALE_ENDED";

export type EventMetricTone = "flash" | "drop" | "neutral";

export interface EventMetric {
  value: string;
  label: string;
  hint?: string;
  tone?: EventMetricTone;
}

export interface EventSignal {
  label: string;
  value: string;
}

export interface FlashEvent {
  id: string;
  brand: string;
  collectionTag: string;
  title: string;
  subtitle: string;
  saleStartsAt: Date;
  saleDuration: number;
  phase: EventPhase;
  totalSlots: number;
  releaseInterval: number;
  batchSize: number;
  queueSize: number;
  piecesAvailable: number;
  location: string;
  heroLabel: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  introEyebrow: string;
  introTitle: string;
  introCopy: string;
  previewEyebrow: string;
  previewTitle: string;
  previewCopy: string;
  brandEyebrow: string;
  brandStoryTitle: string;
  brandStoryCopy: string;
  metrics: EventMetric[];
  scarcityStats: EventMetric[];
  signals: EventSignal[];
}

