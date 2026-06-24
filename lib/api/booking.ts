import type { Booking } from "@/lib/types";

const KEY = "klay-bookings";

function read(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as Booking[];
  } catch {
    return [];
  }
}

function write(list: Booking[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function getBookings(): Booking[] {
  return read();
}

export function getBookedHours(courtId: string, date: string): number[] {
  return read()
    .filter((b) => b.courtId === courtId && b.date === date)
    .map((b) => b.hour);
}

function code() {
  const id = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KLAY-${id}`;
}

export type NewBooking = Omit<Booking, "id" | "createdAt">;

/** Mock API: simulates network latency, then persists to localStorage. */
export async function createBooking(input: NewBooking): Promise<Booking> {
  await new Promise((r) => setTimeout(r, 900));
  const booking: Booking = {
    ...input,
    id: code(),
    createdAt: Date.now(),
  };
  const list = read();
  list.push(booking);
  write(list);
  return booking;
}
