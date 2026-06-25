"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CoachesGrid } from "@/components/coaches/CoachesGrid";
import { useLang } from "@/lib/i18n/LangProvider";

export function CoachesSection() {
  const { t } = useLang();
  return (
    <section id="coaches" className="bg-paper py-24 md:py-32">
      <Container>
        <SectionHeader
          label={t({ id: "Coach", en: "Coaches" })}
          meta={t({ id: "6 coach bersertifikat", en: "6 certified coaches" })}
          title={t({ id: "Dilatih oleh yang terbaik.", en: "Trained by the best." })}
          intro={t({
            id: "Tim coach bersertifikat untuk setiap level dan tujuan — dari pemula hingga atlet kompetisi.",
            en: "A certified coaching team for every level and goal — from first-timers to competitors.",
          })}
        />
        <div className="mt-14">
          <CoachesGrid />
        </div>
      </Container>
    </section>
  );
}
