"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import type { FlashEvent } from "@/types/event";

import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Body, Display, Label } from "@/components/primitives/Typography";
import { heroLine, heroStagger } from "@/lib/motion";

import { CountdownDisplay } from "../ui/CountdownDisplay";
import { LiveTicker } from "../ui/LiveTicker";
import { NotificationSignup } from "../ui/NotificationSignup";

interface EventHeroProps {
  event: FlashEvent;
}

export function EventHero({ event }: EventHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 34]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="event-hero" ref={heroRef}>
      <motion.div
        className="event-hero__backdrop"
        style={prefersReducedMotion ? undefined : { y: backdropY }}
      />
      <div className="event-hero__glow event-hero__glow--flash" />
      <div className="event-hero__glow event-hero__glow--drop" />
      <Container className="event-hero__container">
        <motion.div
          animate="animate"
          className="event-hero__layout"
          initial="initial"
          variants={heroStagger}
        >
          <motion.div
            className="event-hero__content"
            style={prefersReducedMotion ? undefined : { y: contentY }}
          >
            <motion.div variants={heroLine}>
              <Badge size="md" variant="neutral">
                {event.collectionTag}
              </Badge>
            </motion.div>

            <motion.div variants={heroLine}>
              <Label>{event.heroLabel}</Label>
            </motion.div>

            <motion.div className="event-hero__headline" variants={heroLine}>
              <Display>{event.brand}</Display>
              <Display className="event-hero__headline-accent">{event.title}</Display>
            </motion.div>

            <motion.div variants={heroLine}>
              <Body className="event-hero__copy">{event.subtitle}</Body>
            </motion.div>

            <motion.div className="event-hero__actions" variants={heroLine}>
              <Button cursor="go" onClick={() => setIsNotifyOpen((state) => !state)}>
                {event.ctaLabel}
              </Button>
              <Button onClick={() => scrollToSection("event-intro")} variant="ghost">
                {event.secondaryCtaLabel}
              </Button>
            </motion.div>

            <AnimatePresence initial={false}>
              {isNotifyOpen ? (
                <NotificationSignup
                  key="hero-notify"
                  onSuccess={() => setIsNotifyOpen(false)}
                  successTitle="You're on the list"
                  successMessage="You're on the list. We'll notify you when the drop starts."
                  support="Drop your email and we’ll send a reminder the moment access opens."
                  title="Launch reminder"
                />
              ) : null}
            </AnimatePresence>
          </motion.div>

          <motion.aside className="event-hero__aside" variants={heroLine}>
            <div className="hero-panel">
              <div className="hero-panel__top">
                <Label>Sale opens in</Label>
                <span className="hero-panel__meta">{event.location}</span>
              </div>
              <CountdownDisplay targetDate={event.saleStartsAt} />
            </div>

            <div className="hero-panel hero-panel--metrics">
              {event.metrics.map((metric) => (
                <div className={`hero-metric hero-metric--${metric.tone ?? "neutral"}`} key={metric.label}>
                  <span className="hero-metric__value">{metric.value}</span>
                  <span className="hero-metric__label">{metric.label}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        </motion.div>

        <motion.div className="event-hero__ticker" variants={heroLine}>
          <LiveTicker
            items={[
              `${event.queueSize.toLocaleString()} people watching`,
              `${event.piecesAvailable} pieces only`,
              `Batches release every ${Math.round(event.releaseInterval / 1000)}s`,
              `${event.batchSize} slots per wave`
            ]}
          />
        </motion.div>
      </Container>
    </section>
  );
}
