import type { Slot, SlotState } from "@/lib/types";
import { seeded } from "@/lib/utils";
import { currentHour, todayISO } from "@/lib/dates";
import { getBookedHours } from "@/lib/api/booking";

export const OPEN_HOUR = 6;
export const CLOSE_HOUR = 23; // slots start 06:00 .. 22:00

/**
 * Deterministic slot availability so the grid looks real and stable across
 * reloads. The `live` flag adds client-only signals (current time + the user's
 * localStorage bookings); keep it FALSE during SSR / first render so server and
 * client markup match (no hydration mismatch), then pass TRUE after mount.
 */
export function generateSlots(courtId: string, date: string, live = false): Slot[] {
  const userBooked = live ? getBookedHours(courtId, date) : [];
  const isToday = date === todayISO();
  const nowH = currentHour();
  const slots: Slot[] = [];

  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    let state: SlotState = "available";
    const r = seeded(`${courtId}|${date}|${h}`);
    // evenings are busier than mornings (deterministic, SSR-safe)
    const occupancy = h >= 17 ? 0.62 : h >= 12 ? 0.74 : 0.82;
    if (r > occupancy) state = "booked";
    if (live && isToday && h < nowH) state = "booked";
    if (live && isToday && h === nowH) state = "live";
    if (userBooked.includes(h)) state = "booked";
    slots.push({ hour: h, state });
  }
  return slots;
}
