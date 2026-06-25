import type { Localized } from "@/lib/types";

export const stats: { value: number; suffix: string; label: Localized }[] = [
  { value: 8, suffix: "", label: { id: "Lapangan premium", en: "Premium courts" } },
  { value: 2400, suffix: "+", label: { id: "Member aktif", en: "Active members" } },
  { value: 64000, suffix: "+", label: { id: "Jam dimainkan", en: "Hours played" } },
  { value: 18, suffix: "", label: { id: "Turnamen / tahun", en: "Tournaments / year" } },
];

export const manifesto: { lead: Localized; lines: Localized[] } = {
  lead: { id: "Bukan sekadar lapangan.", en: "More than a court." },
  lines: [
    {
      id: "KLAY adalah ritual sore — tempat tanah, keringat, dan tawa bertemu.",
      en: "KLAY is an evening ritual — where ground, sweat, and laughter meet.",
    },
    {
      id: "Empat dinding kaca, satu komunitas, dan permainan yang membuatmu kembali.",
      en: "Four glass walls, one community, and a game that keeps calling you back.",
    },
  ],
};

export const galleryImages: { src: string; alt: Localized; tall?: boolean }[] = [
  { src: "/images/court-2.jpg", alt: { id: "Lapangan saat golden hour", en: "Court at golden hour" }, tall: true },
  { src: "/images/detail-rackets-1.jpg", alt: { id: "Raket dan bola padel", en: "Padel rackets and balls" } },
  { src: "/images/detail-rackets-2.jpg", alt: { id: "Detail raket di lapangan", en: "Racket detail on court" } },
  { src: "/images/detail-grip.jpg", alt: { id: "Genggaman raket", en: "Racket grip" } },
  { src: "/images/court-3.jpg", alt: { id: "Arena kaca", en: "Glass arena" }, tall: true },
  { src: "/images/detail-ball.jpg", alt: { id: "Bola di lapangan", en: "Ball on court" } },
  { src: "/images/court-1.jpg", alt: { id: "Centre court", en: "Centre court" } },
  { src: "/images/detail-ball2.jpg", alt: { id: "Bola padel close-up", en: "Padel ball close-up" } },
];

export const testimonials: { quote: Localized; name: string; role: Localized }[] = [
  {
    quote: {
      id: "Dari belum pernah pegang raket sampai ikut turnamen member — semua di KLAY. Komunitasnya bikin nagih.",
      en: "From never holding a racket to playing a member tournament — all at KLAY. The community is addictive.",
    },
    name: "GitaAnjani",
    role: { id: "Member Klub", en: "Klub Member" },
  },
  {
    quote: {
      id: "Lapangannya kelas turnamen dan booking-nya gampang banget. Coach-nya benar-benar paham cara mengajar.",
      en: "Tournament-grade courts and booking is effortless. The coaches truly know how to teach.",
    },
    name: "Reza Maulana",
    role: { id: "Member Pro", en: "Pro Member" },
  },
  {
    quote: {
      id: "Sore di KLAY jadi agenda wajib keluarga kami. Anak-anak senang, kami pun makin sehat.",
      en: "An evening at KLAY is now a family ritual. The kids love it and we're fitter than ever.",
    },
    name: "Dewi & Arman",
    role: { id: "Member Sosial", en: "Sosial Members" },
  },
];

export const marqueeWords = [
  "PADEL",
  "KLAY",
  "GOLDEN HOUR",
  "GLASS COURTS",
  "COMMUNITY",
  "TANAH LAPANG",
  "JIWA JUARA",
];

export const club = {
  address: {
    id: "Jl. Senopati No. 88, Jakarta Selatan",
    en: "Jl. Senopati No. 88, South Jakarta",
  } as Localized,
  hours: [
    { day: { id: "Sen–Jum", en: "Mon–Fri" } as Localized, time: "06:00 — 23:00" },
    { day: { id: "Sab–Min", en: "Sat–Sun" } as Localized, time: "05:00 — 24:00" },
  ],
  phone: "+62 811 8000 555",
  email: "main@klay.padel",
};
