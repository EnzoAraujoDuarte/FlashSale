"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type CursorVariant = "hidden" | "base" | "view" | "go";

const TEXT_TARGET_SELECTOR =
  "p, span, h1, h2, h3, h4, h5, h6, label, small, strong, em, time, figcaption";

function resolveCursorTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  if (target.closest("[data-no-cursor]")) {
    return "hidden";
  }

  const cursorTarget = target.closest<HTMLElement>("[data-cursor]");

  if (cursorTarget) {
    return cursorTarget.dataset.cursor ?? "hidden";
  }

  if (target.closest(TEXT_TARGET_SELECTOR)) {
    return "hidden";
  }

  return "base";
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("hidden");
  const [label, setLabel] = useState("");
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const smoothY = useSpring(cursorY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateEnabled = () => {
      setEnabled(mediaQuery.matches);
      document.documentElement.classList.toggle("has-custom-cursor", mediaQuery.matches);
    };

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);

      const cursorTarget = resolveCursorTarget(event.target);

      if (!cursorTarget || cursorTarget === "hidden") {
        setVariant("hidden");
        setLabel("");
        return;
      }

      if (cursorTarget === "view") {
        setVariant("view");
        setLabel("VIEW");
        return;
      }

      if (cursorTarget === "go") {
        setVariant("go");
        setLabel("GO");
        return;
      }

      setVariant("base");
      setLabel("");
    };

    const handleLeave = () => {
      setVariant("hidden");
      setLabel("");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [cursorX, cursorY, enabled]);

  const cursorClassName = useMemo(
    () => `custom-cursor custom-cursor--${variant}`,
    [variant]
  );

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="custom-cursor-shell"
      style={{
        x: smoothX,
        y: smoothY
      }}
    >
      <div className={cursorClassName}>
        <span className="custom-cursor__label">{label}</span>
      </div>
    </motion.div>
  );
}
