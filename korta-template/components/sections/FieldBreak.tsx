"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useLang } from "@/lib/i18n/LangProvider";

export function FieldBreak() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative h-[56vh] min-h-[400px] overflow-hidden bg-forest">
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute inset-0 scale-115">
        <Image
          src="/images/court-2.jpg"
          alt={t({ id: "Lapangan padel saat golden hour", en: "Padel court at golden hour" })}
          fill
          sizes="100vw"
          className="editorial-img object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-forest/55" />
      <div className="grain absolute inset-0" />
      <div className="relative z-10 flex h-full items-center">
        <Container>
          <span className="block h-[2px] w-12 rounded-full bg-lime" />
          <p className="mt-6 max-w-2xl font-display text-3xl leading-[1.1] text-paper sm:text-4xl md:text-5xl">
            {t({
              id: "Golden hour, dinding kaca, dan bola yang tak mau berhenti.",
              en: "Golden hour, glass walls, and a ball that won't quit.",
            })}
          </p>
        </Container>
      </div>
    </section>
  );
}
