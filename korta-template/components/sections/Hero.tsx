"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLang } from "@/lib/i18n/LangProvider";
import { courts } from "@/lib/data/courts";
import { generateSlots } from "@/lib/api/slots";
import { todayISO } from "@/lib/dates";

const EASE = [0.16, 1, 0.3, 1] as const;

const headline = {
  id: { pre: ["Tanah", "lapang,", "jiwa"], accent: "juara." },
  en: { pre: ["Grounded."], accent: "Relentless." },
};

export function Hero() {
  const { lang, t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const slots = generateSlots(courts[0].id, todayISO(), true);
    setAvailable(slots.filter((s) => s.state === "available").length);
  }, []);

  const h = headline[lang];
  const words = [...h.pre, h.accent];

  return (
    <section ref={ref} className="relative overflow-hidden pt-[72px]">
      <Container className="relative grid grid-cols-1 items-center gap-10 pb-16 pt-10 md:gap-12 lg:grid-cols-12 lg:pb-24 lg:pt-16">
        {/* Left — type */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-7 flex items-center gap-3"
          >
            <span className="block h-[2px] w-9 rounded-full bg-lime" />
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-forest">Padel Club</span>
            <span className="h-px w-8 bg-line" />
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">Jakarta · Est. 2026</span>
          </motion.div>

          <h1 className="display-fluid font-display text-forest">
            {words.map((w, i) => {
              const isAccent = i === words.length - 1;
              return (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className={`inline-block ${isAccent ? "relative text-green" : ""}`}
                    initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 1, delay: 0.15 + i * 0.09, ease: EASE }}
                  >
                    {w}
                    {i < words.length - 1 ? " " : ""}
                    {isAccent && (
                      <motion.span
                        className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-lime"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.9, delay: 0.15 + words.length * 0.09, ease: EASE }}
                      />
                    )}
                  </motion.span>
                </span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg"
          >
            {t({
              id: "Clubhouse padel premium dengan delapan lapangan kaca. Booking dalam hitungan detik, latih bersama coach pro, jadi bagian dari komunitas.",
              en: "A premium padel clubhouse with eight glass courts. Book in seconds, train with pro coaches, become part of the community.",
            })}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-forest transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_rgba(28,124,84,0.6)]"
            >
              {t({ id: "Booking lapangan", en: "Book a court" })}
            </a>
            <a
              href="#courts"
              className="group inline-flex items-center gap-2 rounded-full border border-forest/25 px-6 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-forest transition-all duration-500 hover:border-forest hover:bg-forest hover:text-paper"
            >
              {t({ id: "Lihat lapangan", en: "Explore courts" })}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Right — visual */}
        <div className="relative lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-mist"
          >
            <motion.div style={{ y: reduce ? 0 : imgY }} className="absolute inset-0 scale-110">
              <Image
                src="/images/hero-main.jpg"
                alt={t({ id: "Pemain padel beraksi", en: "Padel player in action" })}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="editorial-img object-cover"
              />
            </motion.div>

            {/* availability peek */}
            <motion.a
              href="#booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-paper/85 px-5 py-4 backdrop-blur-md"
            >
              <div className="flex flex-col">
                <span className="label text-[0.62rem]">{t({ id: "Hari ini", en: "Today" })}</span>
                <span className="mt-1 font-display text-xl text-forest">
                  {available ?? "—"} {t({ id: "slot tersedia", en: "slots open" })}
                </span>
              </div>
              <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-wider text-green">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                </span>
                Live
                <ArrowUpRight size={14} strokeWidth={2} />
              </span>
            </motion.a>
          </motion.div>
        </div>
      </Container>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: reduce ? 1 : fade }}
        className="pointer-events-none flex justify-center pb-8"
      >
        <span className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-muted">
          <ArrowDown size={14} className="animate-bounce" />
          {t({ id: "Gulir", en: "Scroll" })}
        </span>
      </motion.div>
    </section>
  );
}
