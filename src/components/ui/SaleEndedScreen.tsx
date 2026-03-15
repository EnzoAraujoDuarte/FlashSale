"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/primitives/Button";
import { Section } from "@/components/primitives/Section";
import { Body, Display, Label } from "@/components/primitives/Typography";
import { fadeInScale } from "@/lib/motion";

import { NotificationSignup } from "./NotificationSignup";

interface SaleEndedScreenProps {
  collectionTag: string;
}

export function SaleEndedScreen({ collectionTag }: SaleEndedScreenProps) {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  return (
    <Section className="sale-ended" tone="surface">
      <motion.div
        className="sale-ended__panel"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInScale}
      >
        <div className="sale-ended__copy">
          <Label>{collectionTag}</Label>
          <Display className="sale-ended__title">The drop has ended.</Display>
          <Body className="sale-ended__support">Stay close. The next one drops soon.</Body>
        </div>
        <Button
          onClick={() => setIsNotifyOpen((state) => !state)}
          variant="ghost"
        >
          Get notified for the next drop
        </Button>
        <AnimatePresence initial={false}>
          {isNotifyOpen ? (
            <NotificationSignup
              key="sale-ended-notify"
              onSuccess={() => setIsNotifyOpen(false)}
              successTitle="Next drop alert armed"
              successMessage="You'll be the first to know about the next drop."
              support="Join the alert list and we’ll send the next release straight to your inbox."
              title="Next drop alert"
            />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
