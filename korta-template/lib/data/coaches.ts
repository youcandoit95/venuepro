import type { Coach, CoachFocus, Localized } from "@/lib/types";

export const focusOptions: { key: CoachFocus; label: Localized }[] = [
  { key: "technique", label: { id: "Teknik", en: "Technique" } },
  { key: "strategy", label: { id: "Strategi", en: "Strategy" } },
  { key: "serve", label: { id: "Servis", en: "Serve" } },
  { key: "competition", label: { id: "Kompetisi", en: "Competition" } },
  { key: "fitness", label: { id: "Fisik", en: "Fitness" } },
  { key: "junior", label: { id: "Junior", en: "Junior" } },
];

export const coaches: Coach[] = [
  {
    slug: "raka-pratama",
    name: "Raka Pratama",
    portrait: "/images/coach-3.jpg",
    role: { id: "Head Coach", en: "Head Coach" },
    level: "Pro",
    focus: ["strategy", "competition", "serve"],
    rating: 4.9,
    years: 12,
    sessions: 3200,
    languages: ["ID", "EN", "ES"],
    specialties: [
      { id: "Strategi & taktik", en: "Strategy & tactics" },
      { id: "Servis & bandeja", en: "Serve & bandeja" },
    ],
    bio: {
      id: "Mantan pemain nasional yang membawa pendekatan taktis ala World Padel Tour ke setiap sesi. Raka membaca permainan seperti papan catur.",
      en: "A former national player bringing a World Padel Tour tactical approach to every session. Raka reads the game like a chessboard.",
    },
    certifications: ["FIP Coach Level 3", "WPT Academy", "Sport Science S1"],
    availability: ["Sen", "Rab", "Jum", "Sab"],
  },
  {
    slug: "sinta-halim",
    name: "Sinta Halim",
    portrait: "/images/coach-1.jpg",
    role: { id: "Technique Coach", en: "Technique Coach" },
    level: "Intermediate",
    focus: ["technique", "serve"],
    rating: 4.8,
    years: 8,
    sessions: 2100,
    languages: ["ID", "EN"],
    specialties: [
      { id: "Teknik dasar", en: "Core technique" },
      { id: "Kontrol & sentuhan", en: "Control & touch" },
    ],
    bio: {
      id: "Spesialis fondasi. Sinta memecah setiap pukulan jadi langkah kecil yang mudah dikuasai pemula maupun pemain menengah.",
      en: "A fundamentals specialist. Sinta breaks every stroke into small, masterable steps for beginners and improvers alike.",
    },
    certifications: ["FIP Coach Level 2", "Padel Federation ID"],
    availability: ["Sel", "Kam", "Sab", "Min"],
  },
  {
    slug: "bayu-santoso",
    name: "Bayu Santoso",
    portrait: "/images/coach-4.jpg",
    role: { id: "Strategy Coach", en: "Strategy Coach" },
    level: "Pro",
    focus: ["strategy", "competition"],
    rating: 4.9,
    years: 10,
    sessions: 2600,
    languages: ["ID", "EN"],
    specialties: [
      { id: "Permainan ganda", en: "Doubles play" },
      { id: "Positioning", en: "Court positioning" },
    ],
    bio: {
      id: "Otak di balik banyak pasangan juara klub. Bayu mengajarkan cara bergerak sebagai satu unit dan mengunci poin penting.",
      en: "The brain behind many of the club's winning pairs. Bayu teaches you to move as one unit and lock down the big points.",
    },
    certifications: ["FIP Coach Level 3", "Doubles Strategy Cert"],
    availability: ["Sen", "Sel", "Jum"],
  },
  {
    slug: "nadia-putri",
    name: "Nadia Putri",
    portrait: "/images/coach-2.jpg",
    role: { id: "Junior Development", en: "Junior Development" },
    level: "Beginner",
    focus: ["junior", "technique"],
    rating: 5.0,
    years: 6,
    sessions: 1500,
    languages: ["ID", "EN"],
    specialties: [
      { id: "Pengembangan junior", en: "Junior development" },
      { id: "Motivasi & fun", en: "Motivation & fun" },
    ],
    bio: {
      id: "Membuat anak-anak jatuh cinta pada padel sejak pukulan pertama. Sabar, ceria, dan terstruktur.",
      en: "Makes kids fall in love with padel from the first swing. Patient, joyful, and structured.",
    },
    certifications: ["FIP Coach Level 2", "Junior Coaching Cert"],
    availability: ["Rab", "Sab", "Min"],
  },
  {
    slug: "dimas-aryo",
    name: "Dimas Aryo",
    portrait: "/images/coach-6.jpg",
    role: { id: "Fitness & Conditioning", en: "Fitness & Conditioning" },
    level: "Intermediate",
    focus: ["fitness", "competition"],
    rating: 4.7,
    years: 7,
    sessions: 1800,
    languages: ["ID", "EN"],
    specialties: [
      { id: "Kondisi fisik", en: "Physical conditioning" },
      { id: "Kelincahan & footwork", en: "Agility & footwork" },
    ],
    bio: {
      id: "Membangun mesin di balik permainanmu — daya tahan, ledakan, dan footwork yang membuatmu sampai ke setiap bola.",
      en: "Builds the engine behind your game — endurance, explosiveness, and the footwork that gets you to every ball.",
    },
    certifications: ["Strength & Conditioning Cert", "Sport Science S1"],
    availability: ["Sel", "Kam", "Sab"],
  },
  {
    slug: "alya-rahman",
    name: "Alya Rahman",
    portrait: "/images/doubles-2.jpg",
    role: { id: "Performance Coach", en: "Performance Coach" },
    level: "Pro",
    focus: ["competition", "serve", "strategy"],
    rating: 4.8,
    years: 9,
    sessions: 2400,
    languages: ["ID", "EN"],
    specialties: [
      { id: "Mental kompetisi", en: "Competition mindset" },
      { id: "Smash & vibora", en: "Smash & víbora" },
    ],
    bio: {
      id: "Mempersiapkan pemain untuk tekanan turnamen — dari ritual pra-laga hingga pukulan penutup yang dingin.",
      en: "Prepares players for tournament pressure — from pre-match rituals to the cold-blooded finishing shot.",
    },
    certifications: ["FIP Coach Level 3", "Mental Performance Cert"],
    availability: ["Sen", "Kam", "Min"],
  },
];

export function getCoach(slug: string) {
  return coaches.find((c) => c.slug === slug);
}
