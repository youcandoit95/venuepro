"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/lib/motion/Reveal";
import { useLang } from "@/lib/i18n/LangProvider";
import { manifesto } from "@/lib/data/content";

const pillars = [
  {
    n: "01",
    title: { id: "Komunitas", en: "Community" },
    body: { id: "Ratusan member yang main, tumbuh, dan menang bersama.", en: "Hundreds of members who play, grow, and win together." },
  },
  {
    n: "02",
    title: { id: "Lapangan kelas turnamen", en: "Tournament courts" },
    body: { id: "Kaca panorama, rumput premium, pencahayaan presisi.", en: "Panoramic glass, premium turf, precision lighting." },
  },
  {
    n: "03",
    title: { id: "Coaching pro", en: "Pro coaching" },
    body: { id: "Dari pukulan pertama hingga panggung turnamen.", en: "From your first swing to the tournament stage." },
  },
];

export function Manifesto() {
  const { t } = useLang();
  return (
    <section className="bg-paper py-24 md:py-36">
      <Container>
        <span className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-forest">
          <span className="block h-[2px] w-9 rounded-full bg-lime" /> Manifesto
        </span>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <h2 className="font-display text-[2.4rem] leading-[1.08] tracking-[-0.02em] text-forest sm:text-5xl md:text-[3.6rem]">
              <Reveal>
                <span className="text-forest">{t(manifesto.lead)} </span>
              </Reveal>
              {manifesto.lines.map((l, i) => (
                <Reveal key={i} delay={0.08 * (i + 1)}>
                  <span className="text-muted">{t(l)} </span>
                </Reveal>
              ))}
            </h2>
          </div>

          <div className="relative lg:col-span-4">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-mist">
                <Image
                  src="/images/detail-rackets-2.jpg"
                  alt={t({ id: "Detail raket padel", en: "Padel racket detail" })}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="editorial-img object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-3">
          {pillars.map((p) => (
            <Reveal key={p.n} className="bg-paper">
              <div className="flex h-full flex-col gap-3 p-8">
                <span className="mb-1 block h-[2px] w-9 rounded-full bg-lime" />
                <h3 className="font-display text-2xl text-forest">{t(p.title)}</h3>
                <p className="text-sm leading-relaxed text-muted">{t(p.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
