"use client";

import { motion } from "framer-motion";

import type { FlashEvent } from "@/types/event";
import type { Product } from "@/types/product";

import { Button } from "@/components/primitives/Button";
import { Section } from "@/components/primitives/Section";
import { TitleBlock } from "@/components/primitives/TitleBlock";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

import { PreviewProductCard } from "../ui/PreviewProductCard";

interface PreviewSectionProps {
  event: FlashEvent;
  products: Product[];
}

export function PreviewSection({ event, products }: PreviewSectionProps) {
  return (
    <Section className="preview-section" id="preview">
      <motion.div
        className="preview-section__top"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <TitleBlock
          copy={event.previewCopy}
          eyebrow={event.previewEyebrow}
          title={event.previewTitle}
        />
        <Button
          cursor="go"
          onClick={() => document.getElementById("event-top")?.scrollIntoView({ behavior: "smooth" })}
          variant="ghost"
        >
          Hold my place
        </Button>
      </motion.div>

      <motion.div
        className="preview-grid"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={staggerItem}>
            <PreviewProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
