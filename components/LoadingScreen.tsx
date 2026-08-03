"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A brief, elegant loading screen shown once per initial page load,
 * built around the real Soul Hues logo mark. Purely presentational —
 * it never blocks rendering of the page underneath, it just overlays
 * it briefly for a premium first impression.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Respect users who've asked for reduced motion — skip straight in.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const delay = prefersReducedMotion ? 0 : 1100;
    const timer = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-28 w-28 sm:h-36 sm:w-36"
          >
            <Image
              src="/images/logo-soulhues.png"
              alt=""
              fill
              priority
              sizes="144px"
              className="animate-float object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
