import type { DailyOpeningHours } from "@/types";

// Pure formatting helper — no fetching, callers pass in whatever
// openingHoursRepository.getWeeklyHours() already returned them.
export function getTodayOpeningStatus(hours: DailyOpeningHours[]): { closed: boolean; label: string } {
  const weekday = new Date().getDay() as DailyOpeningHours["weekday"];
  const today = hours.find((d) => d.weekday === weekday);

  if (!today || today.closed) {
    return { closed: true, label: today?.note ?? "Heute geschlossen" };
  }

  const slots = today.slots.map((s) => `${s.open} – ${s.close}`).join(" · ");
  return { closed: false, label: `Heute geöffnet · ${slots}` };
}
