export type Lang = "id" | "en";
export type Localized = { id: string; en: string };

export type Court = {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
  surface: Localized;
  pricePerHour: number;
  features: Localized[];
  image: string;
  tagline: Localized;
};

export type Coach = {
  slug: string;
  name: string;
  portrait: string;
  role: Localized;
  specialties: Localized[];
  level: "Beginner" | "Intermediate" | "Pro";
  focus: CoachFocus[];
  rating: number;
  years: number;
  sessions: number;
  languages: string[];
  bio: Localized;
  certifications: string[];
  availability: string[];
};

export type CoachFocus =
  | "technique"
  | "strategy"
  | "junior"
  | "fitness"
  | "serve"
  | "competition";

export type SlotState = "available" | "booked" | "live";
export type Slot = { hour: number; state: SlotState };

export type Booking = {
  id: string;
  courtId: string;
  date: string; // yyyy-mm-dd
  hour: number;
  coachSlug?: string;
  name: string;
  phone: string;
  createdAt: number;
};

export type MembershipTier = {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  tagline: Localized;
  perks: Localized[];
  recommended?: boolean;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  level: string;
  tierId: string;
  createdAt: number;
};
