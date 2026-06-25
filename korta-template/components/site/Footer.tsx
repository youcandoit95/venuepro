"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { useLang } from "@/lib/i18n/LangProvider";
import { club } from "@/lib/data/content";

export function Footer() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const navLinks = [
    { href: "#courts", label: { id: "Lapangan", en: "Courts" } },
    { href: "#booking", label: { id: "Booking", en: "Booking" } },
    { href: "#coaches", label: { id: "Coach", en: "Coaches" } },
    { href: "#membership", label: { id: "Membership", en: "Membership" } },
    { href: "/daftar", label: { id: "Daftar Member", en: "Join" } },
  ];
  const socials = ["Instagram", "TikTok", "YouTube", "WhatsApp"];

  return (
    <footer id="contact" className="grain relative overflow-hidden bg-forest text-paper">
      <Container className="relative z-10 py-20 md:py-28">
        <div className="flex flex-col gap-6 border-b border-paper/15 pb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="display-fluid text-paper">
            {lang === "id" ? "Ayo main." : "Let's play."}
          </h2>
          <a
            href="#booking"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-forest transition-transform duration-500 hover:-translate-y-0.5"
          >
            {lang === "id" ? "Booking lapangan" : "Book a court"}
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo invert />
            <p className="max-w-[16rem] text-sm leading-relaxed text-paper/60">
              {lang === "id"
                ? "Clubhouse padel premium. Tanah lapang, jiwa juara."
                : "A premium padel clubhouse. Grounded, relentless."}
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="label text-paper/70">{lang === "id" ? "Jelajah" : "Explore"}</span>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="link-underline w-fit text-sm text-paper/80 hover:text-paper">
                {t(l.label)}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="label text-paper/70">{lang === "id" ? "Kunjungi" : "Visit"}</span>
            <p className="text-sm text-paper/80">{t(club.address)}</p>
            <a href={`tel:${club.phone}`} className="link-underline w-fit text-sm text-paper/80 hover:text-paper">
              {club.phone}
            </a>
            <a href={`mailto:${club.email}`} className="link-underline w-fit text-sm text-paper/80 hover:text-paper">
              {club.email}
            </a>
            <div className="mt-2 flex flex-col gap-1">
              {club.hours.map((h, i) => (
                <div key={i} className="flex justify-between gap-6 text-sm text-paper/60">
                  <span>{t(h.day)}</span>
                  <span className="font-mono">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="label text-paper/70">Newsletter</span>
            <p className="text-sm text-paper/60">
              {lang === "id" ? "Info turnamen & promo member." : "Tournaments & member perks."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
              className="mt-1 flex items-center gap-2 border-b border-paper/25 pb-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === "id" ? "Email kamu" : "Your email"}
                className="w-full bg-transparent text-sm text-paper placeholder:text-paper/70 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="text-lime">
                <ArrowUpRight size={18} strokeWidth={2} />
              </button>
            </form>
            {sent && (
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-lime">
                {lang === "id" ? "Terkirim — sampai jumpa di lapangan!" : "Subscribed — see you on court!"}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((s) => (
                <a key={s} href="#" className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/50 hover:text-paper">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-paper/70 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[0.7rem] uppercase tracking-wider">
            © 2026 KLAY Padel Club
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-wider">
            {lang === "id" ? "Dibuat di Jakarta" : "Made in Jakarta"}
          </p>
        </div>
      </Container>
    </footer>
  );
}
