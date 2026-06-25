import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { coaches, getCoach } from "@/lib/data/coaches";
import { CoachDetail } from "@/components/coaches/CoachDetail";

export function generateStaticParams() {
  return coaches.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const coach = getCoach(slug);
  return { title: coach ? `${coach.name} — Coach` : "Coach" };
}

export default async function CoachPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coach = getCoach(slug);
  if (!coach) notFound();
  return <CoachDetail coach={coach} />;
}
