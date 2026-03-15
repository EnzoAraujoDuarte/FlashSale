import type { FlashEvent } from "@/types/event";

const DEFAULT_SALE_OFFSET_MS = 42 * 60 * 1000 + 19 * 1000;

export function createEventMock(overrides: Partial<FlashEvent> = {}): FlashEvent {
  const saleStartsAt = overrides.saleStartsAt ?? new Date(Date.now() + DEFAULT_SALE_OFFSET_MS);

  return {
    id: "drop-047",
    brand: "Aether Division",
    collectionTag: "LIMITED DROP 047",
    title: "Velocity Archive",
    subtitle:
      "A tightly released capsule engineered for one-night access, built around utility silhouettes, soft structure, and fast exits.",
    saleStartsAt,
    saleDuration: 90,
    phase: "PRE_SALE",
    totalSlots: 3200,
    releaseInterval: 15000,
    batchSize: 75,
    queueSize: 2843,
    piecesAvailable: 200,
    location: "Sao Paulo relay node",
    heroLabel: "Cinematic commerce event",
    ctaLabel: "Notify me at launch",
    secondaryCtaLabel: "View drop details",
    introEyebrow: "The drop",
    introTitle: "A focused release with speed, control, and product clarity.",
    introCopy:
      "Everything in this event is tuned for urgency without noise: scarce inventory, narrow access windows, and a surface designed to keep attention on the product.",
    previewEyebrow: "Whats dropping",
    previewTitle: "Editorial silhouettes staged for a fast-moving sale window.",
    previewCopy:
      "Aether Division built this release around lightweight outerwear, dense jersey, and travel-grade accessories that sell best when the interface stays frictionless.",
    brandEyebrow: "Brand signal",
    brandStoryTitle: "Streetwear restraint, event energy, premium execution.",
    brandStoryCopy:
      "The visual language borrows from runway editorial and operational dashboards: strong headlines, crisp metrics, controlled glow, and product-first spacing.",
    metrics: [
      { value: "200", label: "pieces only", tone: "flash" },
      { value: "60%", label: "event markdown", tone: "drop" },
      { value: "90 min", label: "sale window", tone: "neutral" }
    ],
    scarcityStats: [
      { value: "12", label: "batches planned", hint: "released progressively", tone: "flash" },
      { value: "75", label: "slots per release", hint: "keeps flow controlled", tone: "drop" },
      { value: "3.2k", label: "people watching", hint: "queue interest right now", tone: "neutral" }
    ],
    signals: [
      { label: "Queue preview", value: "Batch 12 opening first" },
      { label: "Access window", value: "Admitted users get 10 minutes to secure cart" },
      { label: "Fulfillment mode", value: "Same-day dispatch on all confirmed orders" }
    ],
    ...overrides
  };
}

export const eventMock = createEventMock();

export const saleEndsAt = new Date(
  eventMock.saleStartsAt.getTime() + eventMock.saleDuration * 60 * 1000
);
