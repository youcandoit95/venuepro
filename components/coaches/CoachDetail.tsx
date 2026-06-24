"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Award, Star } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/lib/motion/Reveal";
import { useLang } from "@/lib/i18n/LangProvider";
import type { Coach } from "@/lib/types";

const DAY_EN: Record<string, string> = {
  Sen: "Mon", Sel: "Tue", Rab: "Wed", Kam: "Thu", Jum: "Fri", Sab: "Sat", Min: "Sun",
};
const ALL_DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function CoachDetail({ coach }: { coach: Coach }) {
  const { t, lang } = useLang();
  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <Container className="py-12 md:py-20">
          <Link
            href="/#coaches"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted hover:text-forest"
          >
            <ArrowLeft size={14} /> {t({ id: "Semua coach", en: "All coaches" })}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Portrait */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <Reveal>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-mist">
                    <Image
                      src={coach.portrait}
                      alt={coach.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="editorial-img object-cover"
                    />
                  </div>
                </Reveal>
                <Link
                  href={`/book?coach=${coach.slug}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper transition-all duration-500 hover:-translate-y-0.5 hover:bg-ink"
                >
                  {t({ id: "Booking coach ini", en: "Book this coach" })}
                  <ArrowUpRight size={16} strokeWidth={2} />
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-7">
              <Reveal>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-green">
                  {t(coach.role)} · {coach.level}
                </span>
                <h1 className="mt-3 font-display text-5xl text-forest md:text-6xl">{coach.name}</h1>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
                  <Stat icon={<Star size={15} className="fill-lime text-lime" />} value={coach.rating.toFixed(1)} label={t({ id: "Rating", en: "Rating" })} />
                  <Stat value={`${coach.years}`} label={t({ id: "Tahun", en: "Years" })} />
                  <Stat value={`${coach.sessions.toLocaleString("id-ID")}+`} label={t({ id: "Sesi", en: "Sessions" })} />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-8 text-lg leading-relaxed text-ink/80">{t(coach.bio)}</p>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-8">
                  <span className="label">{t({ id: "Spesialisasi", en: "Specialties" })}</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {coach.specialties.map((s, i) => (
                      <span key={i} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-forest">
                        {t(s)}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <span className="label">{t({ id: "Sertifikasi", en: "Certifications" })}</span>
                    <ul className="mt-3 flex flex-col gap-2">
                      {coach.certifications.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-ink/80">
                          <Award size={14} className="text-green" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="label">{t({ id: "Bahasa", en: "Languages" })}</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {coach.languages.map((l) => (
                        <span key={l} className="rounded-full bg-mist px-3 py-1.5 font-mono text-[0.7rem] text-forest">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-8">
                  <span className="label">{t({ id: "Ketersediaan", en: "Availability" })}</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ALL_DAYS.map((d) => {
                      const on = coach.availability.includes(d);
                      return (
                        <span
                          key={d}
                          className={`flex h-10 w-12 items-center justify-center rounded-xl font-mono text-[0.72rem] ${
                            on ? "bg-forest text-paper" : "border border-line text-muted/50"
                          }`}
                        >
                          {lang === "id" ? d : DAY_EN[d]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function Stat({ icon, value, label }: { icon?: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 font-display text-2xl text-forest">
        {icon}
        {value}
      </span>
      <span className="font-mono text-[0.64rem] uppercase tracking-wider text-muted">{label}</span>
    </div>
  );
}
