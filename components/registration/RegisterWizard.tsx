"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n/LangProvider";
import { tiers } from "@/lib/data/membership";
import { loadDraft, registerMember, saveDraft } from "@/lib/api/members";
import { cn, formatIDR } from "@/lib/utils";
import type { Member } from "@/lib/types";

type Form = {
  name: string;
  email: string;
  phone: string;
  level: string;
  goal: string;
  times: string[];
  tierId: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function RegisterWizard({ defaultTier }: { defaultTier?: string }) {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Member | null>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    level: "",
    goal: "",
    times: [],
    tierId: defaultTier ?? "klub",
  });

  useEffect(() => {
    const draft = loadDraft<Form>();
    if (draft) setForm((f) => ({ ...draft, tierId: defaultTier ?? draft.tierId }));
  }, [defaultTier]);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      saveDraft(next);
      return next;
    });
  }

  function toggleTime(v: string) {
    set("times", form.times.includes(v) ? form.times.filter((x) => x !== v) : [...form.times, v]);
  }

  const levels = [
    { v: "Beginner", l: { id: "Pemula", en: "Beginner" } },
    { v: "Intermediate", l: { id: "Menengah", en: "Intermediate" } },
    { v: "Advanced", l: { id: "Mahir", en: "Advanced" } },
  ];
  const goals = [
    { v: "fun", l: { id: "Main seru", en: "Just for fun" } },
    { v: "improve", l: { id: "Tingkatkan skill", en: "Improve" } },
    { v: "compete", l: { id: "Kompetisi", en: "Compete" } },
  ];
  const timeOpts = [
    { v: "morning", l: { id: "Pagi", en: "Morning" } },
    { v: "afternoon", l: { id: "Siang", en: "Afternoon" } },
    { v: "evening", l: { id: "Malam", en: "Evening" } },
  ];

  const steps = [
    { id: "akun", label: { id: "Akun", en: "Account" } },
    { id: "profil", label: { id: "Profil", en: "Profile" } },
    { id: "paket", label: { id: "Paket", en: "Plan" } },
    { id: "review", label: { id: "Review", en: "Review" } },
  ];

  function validate(): boolean {
    setError(null);
    if (step === 0) {
      if (form.name.trim().length < 2) return fail({ id: "Nama belum diisi.", en: "Enter your name." });
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return fail({ id: "Email belum valid.", en: "Enter a valid email." });
      if (form.phone.replace(/\D/g, "").length < 8) return fail({ id: "Nomor telepon belum valid.", en: "Enter a valid phone." });
    }
    if (step === 1 && !form.level) return fail({ id: "Pilih level kamu.", en: "Pick your level." });
    if (step === 2 && !form.tierId) return fail({ id: "Pilih paket membership.", en: "Pick a plan." });
    return true;
  }
  function fail(m: { id: string; en: string }) {
    setError(t(m));
    return false;
  }

  function next() {
    if (!validate()) return;
    setDir(1);
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }
  function back() {
    setDir(-1);
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    setSubmitting(true);
    const member = await registerMember({
      name: form.name.trim(),
      email: form.email.trim(),
      level: form.level,
      tierId: form.tierId,
    });
    setSubmitting(false);
    setDone(member);
  }

  const tier = tiers.find((x) => x.id === form.tierId);
  const input =
    "w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-sm focus:border-forest focus:outline-none";

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-auto max-w-xl rounded-[28px] border border-line bg-mist/60 p-8 text-center md:p-12"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lime">
          <Check size={28} strokeWidth={2.5} className="text-forest" />
        </div>
        <h2 className="font-display text-3xl text-forest">
          {t({ id: `Selamat datang, ${done.name.split(" ")[0]}!`, en: `Welcome, ${done.name.split(" ")[0]}!` })}
        </h2>
        <p className="mt-3 text-muted">
          {t({ id: "Keanggotaanmu aktif. Simpan ID member ini.", en: "Your membership is active. Save your member ID." })}
        </p>
        <div className="mx-auto mt-6 w-fit rounded-2xl border border-dashed border-forest/30 bg-paper px-8 py-4">
          <span className="label block">{t({ id: "ID Member", en: "Member ID" })}</span>
          <span className="font-display text-3xl tracking-wide text-forest">{done.id}</span>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/#booking" className="rounded-full bg-forest px-6 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper">
            {t({ id: "Booking pertama", en: "First booking" })}
          </Link>
          <Link href="/" className="rounded-full border border-forest/20 px-6 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-forest">
            {t({ id: "Beranda", en: "Home" })}
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 flex-col gap-2">
            <div className={cn("h-1 rounded-full transition-colors duration-500", i <= step ? "bg-forest" : "bg-line")} />
            <span className={cn("font-mono text-[0.62rem] uppercase tracking-wider", i === step ? "text-forest" : "text-muted")}>
              {i + 1}. {t(s.label)}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-10 min-h-[330px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-2xl text-forest">{t({ id: "Buat akunmu", en: "Create your account" })}</h3>
                <input className={input} placeholder={t({ id: "Nama lengkap", en: "Full name" })} value={form.name} onChange={(e) => set("name", e.target.value)} />
                <input className={input} type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                <input className={input} inputMode="tel" placeholder={t({ id: "No. WhatsApp", en: "Phone / WhatsApp" })} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-6">
                <h3 className="font-display text-2xl text-forest">{t({ id: "Profil padelmu", en: "Your padel profile" })}</h3>
                <Group label={t({ id: "Level saat ini", en: "Current level" })}>
                  {levels.map((o) => (
                    <Chip key={o.v} active={form.level === o.v} onClick={() => set("level", o.v)}>{t(o.l)}</Chip>
                  ))}
                </Group>
                <Group label={t({ id: "Tujuan utama", en: "Main goal" })}>
                  {goals.map((o) => (
                    <Chip key={o.v} active={form.goal === o.v} onClick={() => set("goal", o.v)}>{t(o.l)}</Chip>
                  ))}
                </Group>
                <Group label={t({ id: "Waktu favorit", en: "Preferred times" })}>
                  {timeOpts.map((o) => (
                    <Chip key={o.v} active={form.times.includes(o.v)} onClick={() => toggleTime(o.v)}>{t(o.l)}</Chip>
                  ))}
                </Group>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-2xl text-forest">{t({ id: "Pilih membership", en: "Choose membership" })}</h3>
                <div className="flex flex-col gap-3">
                  {tiers.map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => set("tierId", tr.id)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300",
                        form.tierId === tr.id ? "border-forest bg-forest text-paper" : "border-line hover:border-forest/40",
                      )}
                    >
                      <div>
                        <span className="block font-display text-lg">{tr.name}</span>
                        <span className={cn("text-xs", form.tierId === tr.id ? "text-paper/60" : "text-muted")}>{t(tr.tagline)}</span>
                      </div>
                      <span className="font-mono text-sm">{formatIDR(tr.priceMonthly)}<span className={form.tierId === tr.id ? "text-paper/50" : "text-muted"}>/{lang === "id" ? "bln" : "mo"}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-2xl text-forest">{t({ id: "Konfirmasi", en: "Review" })}</h3>
                <div className="flex flex-col gap-3 rounded-2xl border border-line bg-mist/50 p-6">
                  <Review k={t({ id: "Nama", en: "Name" })} v={form.name} />
                  <Review k="Email" v={form.email} />
                  <Review k={t({ id: "Telepon", en: "Phone" })} v={form.phone} />
                  <Review k={t({ id: "Level", en: "Level" })} v={form.level || "—"} />
                  <Review k={t({ id: "Paket", en: "Plan" })} v={tier ? `${tier.name} · ${formatIDR(tier.priceMonthly)}/${lang === "id" ? "bln" : "mo"}` : "—"} />
                </div>
                <p className="text-center font-mono text-[0.62rem] uppercase tracking-wider text-muted">
                  {t({ id: "Tanpa pembayaran · demo", en: "No payment · demo" })}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && <p role="alert" aria-live="assertive" className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-forest disabled:opacity-0"
        >
          <ArrowLeft size={14} /> {t({ id: "Kembali", en: "Back" })}
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper transition-transform duration-500 hover:-translate-y-0.5"
          >
            {t({ id: "Lanjut", en: "Continue" })} <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper transition-all duration-500 hover:-translate-y-0.5 hover:bg-ink disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> {t({ id: "Memproses…", en: "Processing…" })}</>
            ) : (
              t({ id: "Daftar sekarang", en: "Join now" })
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all duration-300",
        active ? "border-forest bg-forest text-paper" : "border-line text-ink hover:border-forest/40",
      )}
    >
      {children}
    </button>
  );
}

function Review({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted">{k}</span>
      <span className="font-medium text-forest">{v}</span>
    </div>
  );
}
