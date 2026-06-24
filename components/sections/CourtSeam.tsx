"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * KLAY's load-bearing signature: a full-bleed "court line" that draws itself
 * left-to-right as each section seam enters view — the recurring thread that
 * rules the page like the lines of a padel court.
 */
export function CourtSeam({ on = "paper" }: { on?: "paper" | "mist" }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className={`relative h-[2px] w-full ${on === "mist" ? "bg-line" : "bg-line/70"}`}
    >
      <motion.div
        className="absolute inset-0 origin-left bg-lime"
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* net post — a small intersection marker at center court */}
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] bg-forest" />
    </div>
  );
}
