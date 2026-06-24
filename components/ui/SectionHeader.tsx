"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/lib/motion/Reveal";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionHeader({
  label,
  title,
  intro,
  meta,
  align = "left",
  invert = false,
  className,
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
  /** optional content-bearing metadata kicker, e.g. "8 lapangan · 2 indoor" */
  meta?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        align === "center" ? "max-w-2xl mx-auto" : "max-w-3xl",
        className,
      )}
    >
      <motion.div
        className={cn("flex items-center gap-3", align === "center" && "justify-center")}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        {/* the court-line — KLAY's signature delimiter, draws on reveal */}
        <motion.span
          aria-hidden
          className="block h-[2px] w-9 origin-left rounded-full bg-lime"
          variants={{ hidden: { scaleX: reduce ? 1 : 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.span
          className={cn(
            "font-mono text-[0.76rem] uppercase tracking-[0.2em]",
            invert ? "text-paper/80" : "text-forest",
          )}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
        >
          {label}
          {meta && (
            <span className={cn("ml-2 normal-case tracking-normal", invert ? "text-paper/45" : "text-muted")}>
              · {meta}
            </span>
          )}
        </motion.span>
      </motion.div>

      <Reveal delay={0.05}>
        <h2 className={cn("heading-fluid", invert ? "text-paper" : "text-forest")}>{title}</h2>
      </Reveal>

      {intro && (
        <Reveal delay={0.1}>
          <p className={cn("text-base md:text-lg leading-relaxed", invert ? "text-paper/70" : "text-muted")}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
