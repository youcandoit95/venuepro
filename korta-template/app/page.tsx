import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Stats } from "@/components/sections/Stats";
import { Courts } from "@/components/sections/Courts";
import { CourtSeam } from "@/components/sections/CourtSeam";
import { FieldBreak } from "@/components/sections/FieldBreak";
import { BookingSection } from "@/components/sections/BookingSection";
import { CoachesSection } from "@/components/sections/CoachesSection";
import { Membership } from "@/components/sections/Membership";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Stats />
        <Courts />
        <FieldBreak />
        <BookingSection />
        <CourtSeam />
        <CoachesSection />
        <CourtSeam />
        <Membership />
        <CourtSeam />
        <Gallery />
        <CourtSeam />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
