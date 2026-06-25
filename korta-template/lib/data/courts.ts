import type { Court } from "@/lib/types";

export const courts: Court[] = [
  {
    id: "centre",
    name: "Centre Court",
    type: "indoor",
    surface: { id: "Rumput sintetik premium", en: "Premium synthetic turf" },
    pricePerHour: 280000,
    image: "/images/court-1.jpg",
    tagline: {
      id: "Panggung utama, dinding kaca panorama.",
      en: "The main stage, panoramic glass walls.",
    },
    features: [
      { id: "Indoor ber-AC", en: "Air-conditioned indoor" },
      { id: "Pencahayaan turnamen", en: "Tournament lighting" },
      { id: "Tribun penonton", en: "Spectator seating" },
    ],
  },
  {
    id: "sunset",
    name: "Sunset Court",
    type: "outdoor",
    surface: { id: "Rumput sintetik outdoor", en: "Outdoor synthetic turf" },
    pricePerHour: 220000,
    image: "/images/court-2.jpg",
    tagline: {
      id: "Main di bawah langit golden hour.",
      en: "Play beneath the golden-hour sky.",
    },
    features: [
      { id: "Outdoor terbuka", en: "Open-air outdoor" },
      { id: "Lampu sorot malam", en: "Night floodlights" },
      { id: "Pemandangan terbuka", en: "Open views" },
    ],
  },
  {
    id: "arena",
    name: "Glass Arena",
    type: "indoor",
    surface: { id: "Rumput sintetik kompetisi", en: "Competition-grade turf" },
    pricePerHour: 260000,
    image: "/images/court-3.jpg",
    tagline: {
      id: "Arena kaca penuh untuk laga sengit.",
      en: "A full glass cage for fierce rallies.",
    },
    features: [
      { id: "Dinding kaca penuh", en: "Full glass walls" },
      { id: "Akustik premium", en: "Premium acoustics" },
      { id: "Siap turnamen", en: "Tournament-ready" },
    ],
  },
  {
    id: "terrace",
    name: "Terrace Court",
    type: "outdoor",
    surface: { id: "Rumput sintetik cepat", en: "Fast-pace synthetic turf" },
    pricePerHour: 180000,
    image: "/images/court-surface.jpg",
    tagline: {
      id: "Lapangan latihan favorit pagi hari.",
      en: "The favourite morning practice court.",
    },
    features: [
      { id: "Ideal untuk latihan", en: "Ideal for drills" },
      { id: "Sewa raket gratis", en: "Free racket rental" },
      { id: "Akses member 24/7", en: "24/7 member access" },
    ],
  },
  {
    id: "panorama",
    name: "Panorama Court",
    type: "indoor",
    surface: { id: "Rumput sintetik premium", en: "Premium synthetic turf" },
    pricePerHour: 250000,
    image: "/images/doubles-2.jpg",
    tagline: {
      id: "Dinding kaca penuh, sorotan lampu sinematik.",
      en: "Full glass walls, cinematic lighting.",
    },
    features: [
      { id: "Indoor ber-AC", en: "Air-conditioned indoor" },
      { id: "Kaca panorama", en: "Panoramic glass" },
      { id: "Live streaming siap", en: "Live-stream ready" },
    ],
  },
  {
    id: "garden",
    name: "Garden Court",
    type: "outdoor",
    surface: { id: "Rumput sintetik outdoor", en: "Outdoor synthetic turf" },
    pricePerHour: 200000,
    image: "/images/doubles-1.jpg",
    tagline: {
      id: "Dikelilingi taman, sejuk sepanjang sore.",
      en: "Garden-wrapped, breezy all evening.",
    },
    features: [
      { id: "Suasana taman", en: "Garden setting" },
      { id: "Lampu sorot malam", en: "Night floodlights" },
      { id: "Area santai", en: "Lounge area" },
    ],
  },
  {
    id: "academy",
    name: "Academy Court",
    type: "indoor",
    surface: { id: "Rumput sintetik latihan", en: "Training-grade turf" },
    pricePerHour: 190000,
    image: "/images/padel-action-1.jpg",
    tagline: {
      id: "Markas coaching dan kelas grup.",
      en: "Home of coaching and group clinics.",
    },
    features: [
      { id: "Untuk coaching", en: "Coaching-ready" },
      { id: "Papan analisis", en: "Analysis board" },
      { id: "Sewa alat gratis", en: "Free gear rental" },
    ],
  },
  {
    id: "rooftop",
    name: "Rooftop Court",
    type: "outdoor",
    surface: { id: "Rumput sintetik cepat", en: "Fast-pace synthetic turf" },
    pricePerHour: 240000,
    image: "/images/hero-main.jpg",
    tagline: {
      id: "Main di atap kota, langit jadi atapnya.",
      en: "Play above the city, sky as your ceiling.",
    },
    features: [
      { id: "Pemandangan kota", en: "City views" },
      { id: "Sunset terbaik", en: "Best sunsets" },
      { id: "Bar di tepi lapangan", en: "Courtside bar" },
    ],
  },
];

export function getCourt(id: string) {
  return courts.find((c) => c.id === id);
}
