"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { useLang } from "@/lib/i18n/LangProvider";

export function BookingSection() {
  const { t } = useLang();
  return (
    <section id="booking" className="bg-mist py-24 md:py-32">
      <Container>
        <SectionHeader
          align="center"
          label="Booking"
          meta={t({ id: "Buka 06–24 · tiap hari", en: "Open 06–24 · daily" })}
          title={t({ id: "Amankan lapanganmu.", en: "Lock in your court." })}
          intro={t({
            id: "Pilih lapangan, tanggal, dan jam. Tambah coach jika mau. Selesai dalam hitungan detik.",
            en: "Pick a court, date, and time. Add a coach if you like. Done in seconds.",
          })}
        />
        <div className="mt-14">
          <BookingWidget />
        </div>
      </Container>
    </section>
  );
}
