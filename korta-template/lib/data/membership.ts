import type { MembershipTier } from "@/lib/types";

export const tiers: MembershipTier[] = [
  {
    id: "sosial",
    name: "Sosial",
    priceMonthly: 250000,
    priceAnnual: 2500000,
    tagline: {
      id: "Untuk yang main santai akhir pekan.",
      en: "For the casual weekend hitter.",
    },
    perks: [
      { id: "Diskon 10% sewa lapangan", en: "10% off court rental" },
      { id: "Booking 3 hari ke depan", en: "Book up to 3 days ahead" },
      { id: "Akses komunitas KLAY", en: "KLAY community access" },
      { id: "1 sesi open play / bulan", en: "1 open-play session / month" },
    ],
  },
  {
    id: "klub",
    name: "Klub",
    priceMonthly: 650000,
    priceAnnual: 6500000,
    recommended: true,
    tagline: {
      id: "Pilihan member paling populer.",
      en: "The most popular membership.",
    },
    perks: [
      { id: "Diskon 25% sewa lapangan", en: "25% off court rental" },
      { id: "Booking 7 hari ke depan", en: "Book up to 7 days ahead" },
      { id: "4 sesi open play / bulan", en: "4 open-play sessions / month" },
      { id: "1 sesi coaching grup / bulan", en: "1 group coaching / month" },
      { id: "Sewa raket & bola gratis", en: "Free racket & ball rental" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 1200000,
    priceAnnual: 12000000,
    tagline: {
      id: "Untuk yang serius mengejar level.",
      en: "For those chasing the next level.",
    },
    perks: [
      { id: "Diskon 40% sewa lapangan", en: "40% off court rental" },
      { id: "Booking 14 hari ke depan", en: "Book up to 14 days ahead" },
      { id: "Open play tanpa batas", en: "Unlimited open play" },
      { id: "2 sesi coaching privat / bulan", en: "2 private coaching / month" },
      { id: "Prioritas slot prime-time", en: "Priority prime-time slots" },
      { id: "Undangan turnamen member", en: "Member tournament invites" },
    ],
  },
];

export function getTier(id: string) {
  return tiers.find((t) => t.id === id);
}
