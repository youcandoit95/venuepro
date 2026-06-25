import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  invert = false,
  className,
}: {
  invert?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="KLAY — home"
      className={cn(
        "font-display text-[1.7rem] leading-none tracking-[-0.05em] inline-flex items-end",
        invert ? "text-paper" : "text-forest",
        className,
      )}
    >
      KLAY
      <span className="mb-1 ml-1 inline-block h-1.5 w-1.5 rounded-full bg-lime" />
    </Link>
  );
}
