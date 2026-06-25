"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/lib/motion/Reveal";
import { useLang } from "@/lib/i18n/LangProvider";
import { tiers } from "@/lib/data/membership";
import { cn, formatIDR } from "@/lib/utils";

export function Membership() {
  const { t, lang } = useLang();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="membership" className="bg-mist py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            label="Membership"
            meta={t({ id: "3 paket · batal kapan saja", en: "3 plans · cancel anytime" })}
            title={t({ id: "Jadi bagian dari KLAY.", en: "Become part of KLAY." })}
          />
          <Reveal>
            <div className="flex items-center gap-3">
              <div role="group" aria-label={t({ id: "Siklus tagihan", en: "Billing cycle" })} className="inline-flex items-center rounded-full border border-line bg-paper p-1">
                {[
                  { key: false, label: t({ id: "Bulanan", en: "Monthly" }) },
                  { key: true, label: t({ id: "Tahunan", en: "Annual" }) },
                ].map((o) => (
                  <button
                    key={String(o.key)}
                    onClick={() => setAnnual(o.key)}
                    aria-pressed={annual === o.key}
                    className={cn(
                      "rounded-full px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-all duration-300",
                      annual === o.key ? "bg-forest text-paper" : "text-muted hover:text-forest",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <span className="rounded-full bg-lime/25 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-forest">
                {lang === "id" ? "Hemat 2 bln" : "Save 2 mo"}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const price = annual ? tier.priceAnnual : tier.priceMonthly;
            const rec = tier.recommended;
            return (
              <Reveal key={tier.id} delay={i * 0.08}>
                <div
                  className={cn(
                    "flex h-full min-w-0 flex-col rounded-[24px] border p-6 transition-all duration-300 md:p-7 lg:p-8",
                    rec
                      ? "border-forest bg-forest text-paper"
                      : "border-line bg-paper",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={cn("font-display text-2xl", rec ? "text-paper" : "text-forest")}>
                      {tier.name}
                    </h3>
                    {rec && (
                      <span className="rounded-full bg-lime px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-forest">
                        {lang === "id" ? "Populer" : "Popular"}
                      </span>
                    )}
                  </div>
                  <p className={cn("mt-2 text-sm", rec ? "text-paper/60" : "text-muted")}>
                    {t(tier.tagline)}
                  </p>
                  <div className="mt-6 flex flex-wrap items-baseline gap-x-1 gap-y-0">
                    <span className={cn("font-display text-2xl tabular-nums lg:text-4xl", rec ? "text-paper" : "text-forest")}>
                      {formatIDR(price)}
                    </span>
                    <span className={cn("font-mono text-xs", rec ? "text-paper/50" : "text-muted")}>
                      /{annual ? (lang === "id" ? "thn" : "yr") : (lang === "id" ? "bln" : "mo")}
                    </span>
                  </div>

                  <ul className="mt-7 flex flex-1 flex-col gap-3">
                    {tier.perks.map((p, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className={cn("mt-0.5 shrink-0", rec ? "text-lime" : "text-green")}
                        />
                        <span className={rec ? "text-paper/85" : "text-ink"}>{t(p)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/daftar?tier=${tier.id}`}
                    className={cn(
                      "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-all duration-500 hover:-translate-y-0.5",
                      rec
                        ? "bg-lime text-forest hover:shadow-[0_14px_34px_-12px_rgba(28,124,84,0.55)]"
                        : "bg-forest text-paper hover:bg-ink",
                    )}
                  >
                    {t({ id: "Pilih paket", en: "Choose plan" })}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
