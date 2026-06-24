import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { BookHeader } from "@/components/booking/BookHeader";

export const metadata: Metadata = { title: "Booking" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ coach?: string }>;
}) {
  const { coach } = await searchParams;
  return (
    <>
      <Nav />
      <main className="pt-[72px]">
        <Container className="py-16 md:py-24">
          <BookHeader />
          <div className="mt-12">
            <BookingWidget defaultCoach={coach} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
