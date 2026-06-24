import type { Member } from "@/lib/types";

const KEY = "klay-members";
const DRAFT_KEY = "klay-register-draft";

function read(): Member[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as Member[];
  } catch {
    return [];
  }
}

export type NewMember = Omit<Member, "id" | "createdAt">;

function memberId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `KLAY-M${n}`;
}

/** Mock API: simulates latency, then persists the new member. */
export async function registerMember(input: NewMember): Promise<Member> {
  await new Promise((r) => setTimeout(r, 1100));
  const member: Member = { ...input, id: memberId(), createdAt: Date.now() };
  const list = read();
  list.push(member);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
  return member;
}

export function saveDraft(data: unknown) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {}
}

export function loadDraft<T>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
