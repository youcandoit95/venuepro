import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { RegisterWizard } from "@/components/registration/RegisterWizard";

export const metadata: Metadata = { title: "Daftar Member" };

export default async function DaftarPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier } = await searchParams;
  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <Container className="py-14 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted hover:text-forest"
          >
            <ArrowLeft size={14} /> Kembali
          </Link>
          <div className="mt-10">
            <RegisterWizard defaultTier={tier} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
