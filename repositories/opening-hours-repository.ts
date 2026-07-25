// Repository layer. Page/feature code MUST go through this interface.
//
// This is the single source of truth for opening hours consumed by both the
// public site (home page preview, footer) and the staff portal — there is
// only one in-memory copy per server/client bundle, so both surfaces always
// agree without a real database.
//
// TODO (migration): replace with Prisma queries against DailyOpeningHours /
// SpecialOpeningDate tables. Mutations must move behind Server Actions gated
// by opening.manage (see lib/permissions.ts), re-checked server-side.

import type { DailyOpeningHours, SpecialOpeningDate } from "@/types";
import { mockOpeningHours, mockSpecialDates } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const weekly: DailyOpeningHours[] = [...mockOpeningHours];
const special: SpecialOpeningDate[] = [...mockSpecialDates];

export const openingHoursRepository = {
  async getWeeklyHours(): Promise<DailyOpeningHours[]> {
    await tick();
    // Sort Monday(1)..Sunday(0) instead of JS's native Sunday(0)..Saturday(6).
    return [...weekly].sort((a, b) => ((a.weekday + 6) % 7) - ((b.weekday + 6) % 7));
  },
  async updateWeeklyHours(next: DailyOpeningHours[]): Promise<DailyOpeningHours[]> {
    await tick();
    weekly.splice(0, weekly.length, ...next);
    return [...weekly];
  },
  async updateDay(weekday: DailyOpeningHours["weekday"], patch: Partial<DailyOpeningHours>): Promise<DailyOpeningHours> {
    await tick();
    const i = weekly.findIndex((d) => d.weekday === weekday);
    if (i < 0) throw new Error("Weekday not found");
    weekly[i] = { ...weekly[i], ...patch };
    return weekly[i];
  },
  async getSpecialDates(): Promise<SpecialOpeningDate[]> {
    await tick();
    return [...special].sort((a, b) => a.date.localeCompare(b.date));
  },
  async createSpecialDate(input: Omit<SpecialOpeningDate, "id">): Promise<SpecialOpeningDate> {
    await tick();
    const s: SpecialOpeningDate = { ...input, id: crypto.randomUUID() };
    special.push(s);
    return s;
  },
  async updateSpecialDate(id: string, patch: Partial<SpecialOpeningDate>): Promise<SpecialOpeningDate> {
    await tick();
    const i = special.findIndex((s) => s.id === id);
    if (i < 0) throw new Error("Special date not found");
    special[i] = { ...special[i], ...patch };
    return special[i];
  },
  async deleteSpecialDate(id: string): Promise<void> {
    await tick();
    const i = special.findIndex((s) => s.id === id);
    if (i >= 0) special.splice(i, 1);
  },
};
