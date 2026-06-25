"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { useLang } from "@/lib/i18n/LangProvider";
import type { Coach } from "@/lib/types";

export function CoachCard({ coach }: { coach: Coach }) {
  const { t } = useLang();
  return (
    <Link
      href={`/coaches/${coach.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-mist">
        <Image
          src={coach.portrait}
          alt={coach.name}
          fill
          sizes="(max-width: 768px) 50vw, 30vw"
          className="editorial-img object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-paper/85 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-forest backdrop-blur">
            {coach.level}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-forest/85 px-2.5 py-1 font-mono text-[0.6rem] text-paper backdrop-blur">
            <Star size={11} className="fill-lime text-lime" />
            {coach.rating.toFixed(1)}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-lime opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} className="text-forest" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="font-display text-xl text-forest">{coach.name}</h3>
        <span className="font-mono text-[0.68rem] uppercase tracking-wider text-green">
          {t(coach.role)}
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {coach.specialties.map((s, i) => (
            <span key={i} className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-muted">
              {t(s)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
