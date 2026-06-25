"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/lib/motion/Reveal";
import { useLang } from "@/lib/i18n/LangProvider";
import { courts } from "@/lib/data/courts";
import { formatIDR } from "@/lib/utils";

export function Courts() {
  const { t } = useLang();
  const railRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) =>
    railRef.current?.scrollBy({ left: dir * 440, behavior: "smooth" });
  return (
    <section id="courts" className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label={t({ id: "Lapangan", en: "The Courts" })}
            meta={t({ id: "8 lapangan · indoor & outdoor", en: "8 courts · indoor & outdoor" })}
            title={t({ id: "Delapan panggung untuk permainanmu.", en: "Eight stages for your game." })}
          />
          <Reveal>
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => scrollBy(-1)}
                aria-label={t({ id: "Sebelumnya", en: "Previous" })}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-paper"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                aria-label={t({ id: "Berikutnya", en: "Next" })}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-paper"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        </div>
      </Container>

      <div ref={railRef} className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-10">
        {courts.map((c, i) => (
          <Reveal
            key={c.id}
            delay={i * 0.06}
            className="w-[78vw] shrink-0 snap-start sm:w-[420px]"
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-paper">
              <div className="relative aspect-[3/2] overflow-hidden bg-mist">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 78vw, 420px"
                  className="editorial-img object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-forest backdrop-blur">
                  {c.type === "indoor" ? t({ id: "Indoor", en: "Indoor" }) : t({ id: "Outdoor", en: "Outdoor" })}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl text-forest">{c.name}</h3>
                  <span className="font-mono text-sm text-green">{formatIDR(c.pricePerHour)}<span className="text-muted">/{t({ id: "jam", en: "hr" })}</span></span>
                </div>
                <p className="mt-2 text-sm text-muted">{t(c.tagline)}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {c.features.map((f, j) => (
                    <li key={j} className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-muted">
                      {t(f)}
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-forest"
                >
                  {t({ id: "Booking lapangan ini", en: "Book this court" })}
                  <ArrowUpRight size={16} strokeWidth={2} className="text-green transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
        <div className="w-1 shrink-0 md:w-4" aria-hidden />
      </div>
    </section>
  );
}
