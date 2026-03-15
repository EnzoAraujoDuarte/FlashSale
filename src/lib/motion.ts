import type { Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_EXPO = [0.64, 0, 0.78, 0] as const;
export const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

export const DURATION = {
  instant: 0.1,
  fast: 0.15,
  base: 0.25,
  normal: 0.3,
  slow: 0.4
} as const;

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO }
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE_IN_EXPO }
  }
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: EASE_IN_EXPO }
  }
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: EASE_IN_EXPO }
  }
};

export const slideInRight: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO }
  },
  exit: {
    x: "100%",
    transition: { duration: DURATION.normal, ease: EASE_IN_EXPO }
  }
};

export const countdownDigit: Variants = {
  initial: { y: 18, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: DURATION.fast, ease: EASE_OUT_EXPO }
  },
  exit: {
    y: -18,
    opacity: 0,
    transition: { duration: 0.12, ease: EASE_IN_EXPO }
  }
};

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE_OUT_EXPO }
  }
};

export const heroStagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export const heroLine: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO }
  }
};

export const urgencyPulse: Variants = {
  animate: {
    scale: [1, 1.025, 1],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
  }
};

export const softPulse: Variants = {
  animate: {
    opacity: [1, 0.55, 1],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
  }
};

export const dotPulse: Variants = {
  animate: {
    scale: [1, 1.4, 1],
    opacity: [1, 0.6, 1],
    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
  }
};

export const queueProgress = {
  duration: 0.6,
  ease: [0.34, 1.56, 0.64, 1] as const
};

export const progressBar = (value: number) => ({
  animate: {
    scaleX: value / 100,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  }
});

export const feedbackPulse: Variants = {
  initial: { opacity: 0.8, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: [1, 1.02, 1],
    transition: { duration: 0.45, ease: EASE_OUT_QUAD }
  }
};

export const toastSlide: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO }
  },
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: 0.2, ease: EASE_IN_EXPO }
  }
};

export const cartBounce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.18, 0.98, 1],
    transition: { duration: DURATION.normal, ease: EASE_OUT_QUAD }
  }
};

export const cartCountBadge: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.4, 1],
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE_OUT_QUAD }
  },
  exit: {
    scale: 0.7,
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE_IN_EXPO }
  }
};

export const cartThumbnailLift: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.08, 0.94, 1],
    transition: { duration: 0.28, ease: EASE_OUT_QUAD }
  }
};

export const cartFlightTransition = {
  duration: 0.55,
  ease: EASE_OUT_EXPO
} as const;
