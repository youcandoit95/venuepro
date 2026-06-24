"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useLang } from "@/lib/i18n/LangProvider";
import { stats } from "@/lib/data/content";

function CountUp({ value, suffix, play }: { value: number; suffix: string; play: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    if (!play) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, value, reduce]);

  const formatted = value >= 1000 ? n.toLocaleString("id-ID") : n.toString();
  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

export function Stats() {
  const { t } = useLang();
  // ONE shared observer so all four counters fire together — no skipped first item
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section className="grain relative overflow-hidden bg-forest py-20 text-paper md:py-28">
      <Container className="relative z-10">
        <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex min-w-0 flex-col gap-2 border-l border-paper/15 pl-4 md:pl-8"
            >
              <span className="font-display text-[2.4rem] leading-none text-paper sm:text-5xl md:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} play={inView} />
              </span>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-paper/75 md:text-[0.72rem]">
                {t(s.label)}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
