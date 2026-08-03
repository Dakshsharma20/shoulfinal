"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Next.js re-mounts template.tsx on every navigation (unlike layout.tsx,
 * which persists), which is exactly what's needed to trigger a fade/slide
 * transition between pages.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
