"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n/LangProvider";
import { courts } from "@/lib/data/courts";
import { coaches } from "@/lib/data/coaches";
import { generateSlots } from "@/lib/api/slots";
import { createBooking } from "@/lib/api/booking";
import { upcomingDays, prettyDate, relativeDay, weekdayLabel, todayISO } from "@/lib/dates";
import { cn, formatIDR, pad2 } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const COACH_FEE = 150000;
const DAYS = 14;

export function BookingWidget({ defaultCoach }: { defaultCoach?: string }) {
  const { t, lang } = useLang();
  const [courtId, setCourtId] = useState(courts[0].id);
  const [date, setDate] = useState(todayISO());
  const [hour, setHour] = useState<number | null>(null);
  const [coachSlug, setCoachSlug] = useState<string>(defaultCoach ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Booking | null>(null);
  const [tick, setTick] = useState(0); // refresh slots after booking
  const [mounted, setMounted] = useState(false); // SSR-safe: time/localStorage only after mount
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setHour(null), [courtId, date]);

  const court = courts.find((c) => c.id === courtId)!;
  const days = useMemo(() => upcomingDays(DAYS), []);
  const slots = useMemo(
    () => generateSlots(courtId, date, mounted),
    [courtId, date, tick, mounted],
  );
  const coach = coaches.find((c) => c.slug === coachSlug);
  const total = court.pricePerHour + (coach ? COACH_FEE : 0);

  async function confirm() {
    setError(null);
    if (hour === null) {
      setError(t({ id: "Pilih jam dulu.", en: "Pick a time first." }));
      return;
    }
    if (name.trim().length < 2) {
      setError(t({ id: "Nama belum diisi.", en: "Enter your name." }));
      nameRef.current?.focus();
      return;
    }
    if (phone.replace(/\D/g, "").length < 8) {
      setError(t({ id: "Nomor telepon belum valid.", en: "Enter a valid phone." }));
      phoneRef.current?.focus();
      return;
    }
    setSubmitting(true);
    const booking = await createBooking({
      courtId,
      date,
      hour,
      coachSlug: coachSlug || undefined,
      name: name.trim(),
      phone: phone.trim(),
    });
    setSubmitting(false);
    setDone(booking);
    setTick((x) => x + 1);
  }

  function reset() {
    setDone(null);
    setHour(null);
    setName("");
    setPhone("");
  }

  if (done) {
    return <Confirmation booking={done} onReset={reset} />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Selectors */}
      <div className="flex flex-col gap-9 lg:col-span-7">
        {/* Court */}
        <Field step="1" label={t({ id: "Pilih lapangan", en: "Choose a court" })}>
          <div className="flex flex-wrap gap-2.5">
            {courts.map((c) => (
              <button
                key={c.id}
                onClick={() => setCourtId(c.id)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                  courtId === c.id
                    ? "border-forest bg-forest text-paper"
                    : "border-line bg-paper hover:border-forest/40",
                )}
              >
                <span className="block text-sm font-medium">{c.name}</span>
                <span
                  className={cn(
                    "font-mono text-[0.66rem] uppercase tracking-wider",
                    courtId === c.id ? "text-paper/60" : "text-muted",
                  )}
                >
                  {c.type === "indoor" ? t({ id: "Indoor", en: "Indoor" }) : t({ id: "Outdoor", en: "Outdoor" })} · {formatIDR(c.pricePerHour)}
                </span>
              </button>
            ))}
          </div>
        </Field>

        {/* Date */}
        <Field step="2" label={t({ id: "Pilih tanggal", en: "Choose a date" })}>
          <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {days.map((d) => {
              const active = d.date === date;
              const rel = relativeDay(d.date, lang);
              return (
                <button
                  key={d.date}
                  onClick={() => setDate(d.date)}
                  className={cn(
                    "flex min-w-[64px] shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-3 transition-all duration-300",
                    active
                      ? "border-forest bg-forest text-paper"
                      : "border-line bg-paper hover:border-forest/40",
                  )}
                >
                  <span className={cn("font-mono text-[0.6rem] uppercase tracking-wider", active ? "text-paper/60" : "text-muted")}>
                    {weekdayLabel(d.dow, lang)}
                  </span>
                  <span className="font-display text-xl leading-none">{d.dayNum}</span>
                  {rel && (
                    <span className={cn("text-[0.58rem]", active ? "text-lime" : "text-green")}>{rel}</span>
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Time */}
        <Field step="3" label={t({ id: "Pilih jam", en: "Choose a time" })}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {slots.map((s) => {
              const selected = hour === s.hour;
              const disabled = s.state !== "available";
              const stateLabel =
                s.state === "booked"
                  ? t({ id: "terisi", en: "booked" })
                  : s.state === "live"
                    ? t({ id: "sedang main", en: "in play" })
                    : selected
                      ? t({ id: "dipilih", en: "selected" })
                      : t({ id: "tersedia", en: "available" });
              return (
                <button
                  key={s.hour}
                  type="button"
                  disabled={disabled}
                  aria-disabled={disabled}
                  aria-pressed={selected}
                  aria-label={`${pad2(s.hour)}:00 — ${stateLabel}`}
                  onClick={() => setHour(s.hour)}
                  className={cn(
                    "relative flex items-center justify-center gap-1 rounded-xl border py-3 font-mono text-sm transition-all duration-200",
                    selected && "border-forest bg-forest text-paper ring-2 ring-lime ring-offset-1 ring-offset-paper",
                    !selected && s.state === "available" && "border-2 border-green/55 bg-paper text-ink hover:border-forest hover:bg-mist",
                    s.state === "booked" && "cursor-not-allowed border border-line bg-mist text-muted line-through",
                    s.state === "live" && "cursor-not-allowed border-lime/70 bg-lime/15 text-forest",
                  )}
                >
                  {pad2(s.hour)}:00
                  {s.state === "live" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-green" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            <Legend swatch="bg-paper border-2 border-green/60" label={t({ id: "Tersedia", en: "Available" })} />
            <Legend swatch="bg-mist border border-line" strike label={t({ id: "Terisi", en: "Booked" })} />
            <Legend swatch="bg-lime/40 border border-green" dot label={t({ id: "Sedang main", en: "Live" })} />
          </div>
        </Field>
      </div>

      {/* Summary */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 rounded-[24px] border border-line bg-mist/60 p-6 md:p-8">
          <span className="label">{t({ id: "Ringkasan", en: "Summary" })}</span>
          <div className="mt-5 flex flex-col gap-3 border-b border-line pb-5">
            <Row k={t({ id: "Lapangan", en: "Court" })} v={court.name} />
            <Row k={t({ id: "Tanggal", en: "Date" })} v={prettyDate(date, lang)} />
            <Row k={t({ id: "Jam", en: "Time" })} v={hour !== null ? `${pad2(hour)}:00 — ${pad2(hour + 1)}:00` : t({ id: "Pilih jam", en: "Pick a time" })} />
          </div>

          {/* optional coach */}
          <div className="border-b border-line py-5">
            <label className="label mb-2 block">{t({ id: "Coach (opsional)", en: "Coach (optional)" })}</label>
            <select
              value={coachSlug}
              onChange={(e) => setCoachSlug(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm focus:border-forest focus:outline-none"
            >
              <option value="">{t({ id: "Tanpa coach", en: "No coach" })}</option>
              {coaches.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} — {t(c.role)} (+{formatIDR(COACH_FEE)})
                </option>
              ))}
            </select>
          </div>

          {/* inputs */}
          <div className="flex flex-col gap-4 py-5">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.64rem] uppercase tracking-wider text-muted">
                {t({ id: "Nama lengkap", en: "Full name" })} <span className="text-green">*</span>
              </span>
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder={t({ id: "mis. Andi Wijaya", en: "e.g. Andi Wijaya" })}
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm placeholder:text-muted/60 focus:border-forest focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.64rem] uppercase tracking-wider text-muted">
                {t({ id: "No. WhatsApp", en: "Phone / WhatsApp" })} <span className="text-green">*</span>
              </span>
              <input
                ref={phoneRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                placeholder="08xx xxxx xxxx"
                className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm placeholder:text-muted/60 focus:border-forest focus:outline-none"
              />
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <span className="label">{t({ id: "Total", en: "Total" })}</span>
            <span className="font-display text-2xl text-forest">{formatIDR(total)}</span>
          </div>

          {error && <p role="alert" aria-live="assertive" className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            onClick={confirm}
            disabled={submitting || hour === null}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper transition-all duration-500 hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t({ id: "Memproses…", en: "Processing…" })}
              </>
            ) : (
              t({ id: "Konfirmasi booking", en: "Confirm booking" })
            )}
          </button>
          <p className="mt-3 text-center font-mono text-[0.62rem] uppercase tracking-wider text-muted">
            {t({ id: "Tanpa pembayaran · demo", en: "No payment · demo" })}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ step, label, children }: { step: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest font-mono text-[0.66rem] text-paper">
          {step}
        </span>
        <span className="font-display text-lg text-forest">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted">{k}</span>
      <span className="font-medium text-forest">{v}</span>
    </div>
  );
}

function Legend({ swatch, label, strike, dot }: { swatch: string; label: string; strike?: boolean; dot?: boolean }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-muted">
      <span className={cn("relative flex h-4 w-4 items-center justify-center rounded", swatch)}>
        {strike && <span className="absolute h-px w-3 rotate-[-20deg] bg-muted/70" aria-hidden />}
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden />}
      </span>
      {label}
    </span>
  );
}

function Confirmation({ booking, onReset }: { booking: Booking; onReset: () => void }) {
  const { t, lang } = useLang();
  const court = courts.find((c) => c.id === booking.courtId);
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-xl rounded-[28px] border border-line bg-mist/60 p-8 text-center md:p-12"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime">
        <Check size={28} strokeWidth={2.5} className="text-forest" />
      </div>
      <h3 className="font-display text-3xl text-forest">
        {t({ id: "Booking terkonfirmasi!", en: "Booking confirmed!" })}
      </h3>
      <p className="mt-3 text-muted">
        {t({
          id: "Sampai jumpa di lapangan. Tunjukkan kode ini di resepsionis.",
          en: "See you on court. Show this code at reception.",
        })}
      </p>
      <div className="mx-auto mt-6 w-fit rounded-2xl border border-dashed border-forest/30 bg-paper px-8 py-4">
        <span className="label block">{t({ id: "Kode booking", en: "Booking code" })}</span>
        <span className="font-display text-3xl tracking-wide text-forest">{booking.id}</span>
      </div>
      <div className="mt-6 flex flex-col items-center gap-1 text-sm text-forest">
        <span className="font-medium">{court?.name}</span>
        <span className="font-mono text-muted">
          {prettyDate(booking.date, lang)} · {pad2(booking.hour)}:00
        </span>
      </div>
      <button
        onClick={onReset}
        className="mt-8 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-green link-underline"
      >
        {t({ id: "Booking lagi", en: "Book again" })}
      </button>
    </motion.div>
  );
}
