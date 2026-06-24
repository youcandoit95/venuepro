import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/LangProvider";
import { SmoothScroll } from "@/lib/motion/SmoothScroll";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://padel.myansenriadi.com"),
  title: {
    default: "KLAY — Padel Club · Tanah lapang, jiwa juara.",
    template: "%s · KLAY",
  },
  description:
    "KLAY adalah clubhouse padel premium. Booking lapangan, daftar membership, dan latih bersama coach terbaik — semua dalam satu tempat.",
  openGraph: {
    title: "KLAY — Padel Club",
    description:
      "Tanah lapang, jiwa juara. Booking lapangan padel & latih bersama coach pro.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full">
        <LangProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LangProvider>
      </body>
    </html>
  );
}
