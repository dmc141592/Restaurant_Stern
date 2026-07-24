// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace with a Prisma query against a DailyOpeningHours
// table, ordered Monday-first the same way as here.

import type { DailyOpeningHours } from "@/types";
import { mockOpeningHours } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const weekly: DailyOpeningHours[] = [...mockOpeningHours];

export const openingHoursRepository = {
  async getWeeklyHours(): Promise<DailyOpeningHours[]> {
    await tick();
    // Sort Monday(1)..Sunday(0) instead of JS's native Sunday(0)..Saturday(6).
    return [...weekly].sort((a, b) => ((a.weekday + 6) % 7) - ((b.weekday + 6) % 7));
  },
};
