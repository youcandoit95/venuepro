import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:pointer-events-none";

const sizes = "px-6 py-3.5";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-forest hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(28,124,84,0.55)]",
  dark: "bg-forest text-paper hover:-translate-y-0.5 hover:bg-ink",
  outline:
    "border border-forest/20 text-forest hover:border-forest hover:bg-forest hover:text-paper",
  ghost: "text-forest hover:text-green px-0 py-0",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: CommonProps & {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const cls = cn(base, variant !== "ghost" && sizes, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cls}
    >
      {children}
    </button>
  );
}
