"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type Effect = "fade-up" | "fade" | "scale" | "slide-left" | "slide-right";

const effects: Record<Effect, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
};

interface RevealOnScrollProps {
  children: ReactNode;
  effect?: Effect;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "li";
}

export default function RevealOnScroll({
  children,
  effect = "fade-up",
  delay = 0,
  duration = 0.7,
  once = true,
  className,
  as = "div",
}: RevealOnScrollProps) {
  const variants = effects[effect];
  const transition = { duration, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (as === "li") {
    return (
      <motion.li
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-80px" }}
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
