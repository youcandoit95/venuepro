"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n/LangProvider";
import { coaches, focusOptions } from "@/lib/data/coaches";
import { CoachCard } from "@/components/coaches/CoachCard";
import { cn } from "@/lib/utils";
import type { CoachFocus } from "@/lib/types";

export function CoachesGrid() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<CoachFocus | "all">("all");

  const filtered =
    filter === "all" ? coaches : coaches.filter((c) => c.focus.includes(filter));

  const chips: { key: CoachFocus | "all"; label: string }[] = [
    { key: "all", label: lang === "id" ? "Semua" : "All" },
    ...focusOptions.map((f) => ({ key: f.key, label: t(f.label) })),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            aria-pressed={filter === c.key}
            className={cn(
              "inline-flex min-h-[44px] shrink-0 items-center rounded-full border px-5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all duration-300",
              filter === c.key
                ? "border-forest bg-forest text-paper"
                : "border-line text-muted hover:border-forest/40 hover:text-forest",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((coach) => (
            <motion.div
              key={coach.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CoachCard coach={coach} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
