"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLang } from "@/lib/i18n/LangProvider";

export function BookHeader() {
  const { t } = useLang();
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted hover:text-forest"
      >
        <ArrowLeft size={14} /> {t({ id: "Kembali", en: "Back" })}
      </Link>
      <SectionHeader
        label="Booking"
        meta={t({ id: "Buka 06–24 · tiap hari", en: "Open 06–24 · daily" })}
        title={t({ id: "Amankan lapanganmu.", en: "Lock in your court." })}
        intro={t({
          id: "Pilih lapangan, tanggal, dan jam. Tambah coach jika mau.",
          en: "Pick a court, date, and time. Add a coach if you like.",
        })}
      />
    </div>
  );
}
