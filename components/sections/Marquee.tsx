import { marqueeWords } from "@/lib/data/content";

export function Marquee({ invert = false }: { invert?: boolean }) {
  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div
      className={`overflow-hidden border-y-2 py-5 ${
        invert ? "border-lime/40 bg-forest" : "border-lime/50 bg-paper"
      }`}
      aria-hidden
    >
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-8 motion-reduce:animate-none">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={`font-display text-2xl tracking-tight md:text-3xl ${
                invert ? "text-paper" : "text-forest"
              }`}
            >
              {w}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
        ))}
      </div>
    </div>
  );
}
