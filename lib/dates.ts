import type { Lang } from "@/lib/types";
import { pad2 } from "@/lib/utils";

const WD_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const WD_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MO_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type DayOption = { date: string; dow: number; dayNum: number; month: number };

function iso(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function upcomingDays(n: number): DayOption[] {
  const out: DayOption[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({ date: iso(d), dow: d.getDay(), dayNum: d.getDate(), month: d.getMonth() });
  }
  return out;
}

export function todayISO() {
  return iso(new Date());
}

export function currentHour() {
  return new Date().getHours();
}

export function weekdayLabel(dow: number, lang: Lang) {
  return (lang === "id" ? WD_ID : WD_EN)[dow];
}

export function monthLabel(m: number, lang: Lang) {
  return (lang === "id" ? MO_ID : MO_EN)[m];
}

export function prettyDate(dateISO: string, lang: Lang) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${weekdayLabel(dt.getDay(), lang)}, ${d} ${monthLabel(m - 1, lang)}`;
}

export function relativeDay(dateISO: string, lang: Lang): string | null {
  if (dateISO === todayISO()) return lang === "id" ? "Hari ini" : "Today";
  const days = upcomingDays(2);
  if (days[1] && dateISO === days[1].date) return lang === "id" ? "Besok" : "Tomorrow";
  return null;
}
