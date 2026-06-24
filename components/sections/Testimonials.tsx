"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/lib/motion/Reveal";
import { useLang } from "@/lib/i18n/LangProvider";
import { testimonials } from "@/lib/data/content";

export function Testimonials() {
  const { t } = useLang();
  const [feature, ...rest] = testimonials;

  return (
    <section className="bg-mist py-24 md:py-32">
      <Container>
        <SectionHeader
          label={t({ id: "Kata member", en: "Member stories" })}
          meta={t({ id: "2.400+ member", en: "2,400+ members" })}
          title={t({ id: "Dari yang sudah jatuh cinta.", en: "From those already hooked." })}
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* feature pull-quote */}
          <Reveal className="lg:col-span-7">
            <figure className="flex h-full flex-col justify-between">
              <span className="block h-[2px] w-12 rounded-full bg-lime" />
              <blockquote className="mt-6 font-display text-[1.9rem] leading-[1.18] tracking-[-0.01em] text-forest sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
                “{t(feature.quote)}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span className="text-base font-medium text-forest">{feature.name}</span>
                <span className="h-1 w-1 rounded-full bg-muted" />
                <span className="font-mono text-[0.66rem] uppercase tracking-wider text-muted">{t(feature.role)}</span>
              </figcaption>
            </figure>
          </Reveal>

          {/* two smaller, offset */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.map((item, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08} className={i === 1 ? "lg:ml-10" : ""}>
                <figure className="rounded-[20px] border border-line bg-paper p-7">
                  <blockquote className="font-display text-lg leading-snug text-forest">
                    “{t(item.quote)}”
                  </blockquote>
                  <figcaption className="mt-5 flex flex-col">
                    <span className="text-sm font-medium text-forest">{item.name}</span>
                    <span className="font-mono text-[0.64rem] uppercase tracking-wider text-muted">{t(item.role)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
