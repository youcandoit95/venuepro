"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LangToggle } from "@/components/ui/LangToggle";
import { useLang } from "@/lib/i18n/LangProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "#courts", label: { id: "Lapangan", en: "Courts" } },
  { href: "#booking", label: { id: "Booking", en: "Booking" } },
  { href: "#coaches", label: { id: "Coach", en: "Coaches" } },
  { href: "#membership", label: { id: "Membership", en: "Membership" } },
];

export function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "bg-paper/80 backdrop-blur-md border-b border-line"
            : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 md:px-10">
          <Logo />

          <div className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/80 hover:text-forest"
              >
                {t(l.label)}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <LangToggle />
            <a
              href="#booking"
              className="group inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-forest transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(28,124,84,0.55)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-forest" />
              Book
            </a>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-forest md:hidden"
            aria-label={t({ id: "Buka menu", en: "Open menu" })}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper md:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-6">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-forest">
                <X strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 px-6 pb-20">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-5xl tracking-[-0.03em] text-forest"
                >
                  {t(l.label)}
                </motion.a>
              ))}
              <div className="mt-10 flex items-center justify-between">
                <LangToggle />
                <Link
                  href="#booking"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-forest"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
