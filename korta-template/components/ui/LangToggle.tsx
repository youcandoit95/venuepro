"use client";

import { useLang } from "@/lib/i18n/LangProvider";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/types";

export function LangToggle({ invert = false }: { invert?: boolean }) {
  const { lang, setLang } = useLang();
  const langs: Lang[] = ["id", "en"];
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 font-mono text-[0.7rem]",
        invert ? "border-paper/25" : "border-forest/15",
      )}
    >
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase tracking-[0.12em] transition-all duration-400",
            lang === l
              ? invert
                ? "bg-paper text-forest"
                : "bg-forest text-paper"
              : invert
                ? "text-paper/55 hover:text-paper"
                : "text-muted hover:text-forest",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
