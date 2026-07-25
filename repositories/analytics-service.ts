// Calculation layer, isolated from the raw repositories so it can be
// swapped for Prisma aggregate/groupBy queries (or a database view) later
// without touching any page component.

import { format, subDays } from "date-fns";
import { reservationRepository } from "@/repositories/reservation-repository";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import type { ISODate, ReservationStatus } from "@/types";

export type AnalyticsPeriod = "day" | "week" | "month" | "season" | "year" | "custom";

const PERIOD_DAYS: Record<Exclude<AnalyticsPeriod, "custom">, number> = {
  day: 1,
  week: 7,
  month: 30,
  season: 90,
  year: 365,
};

export function resolveRange(period: AnalyticsPeriod, customFrom?: ISODate, customTo?: ISODate) {
  if (period === "custom" && customFrom && customTo) {
    return { from: customFrom, to: customTo };
  }
  const days = PERIOD_DAYS[period === "custom" ? "month" : period];
  return { from: format(subDays(new Date(), days - 1), "yyyy-MM-dd"), to: format(new Date(), "yyyy-MM-dd") };
}

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export interface AnalyticsResult {
  range: { from: ISODate; to: ISODate };
  totals: {
    reservations: number;
    expectedGuests: number;
    averagePartySize: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    noShowRate: number;
    estimatedReturningCustomers: number;
  };
  previousPeriod: {
    reservations: number;
    deltaPct: number | null;
  };
  perDay: { date: string; count: number }[];
  perWeekday: { label: string; count: number }[];
  perHour: { label: string; count: number }[];
  perSeatingArea: { label: string; count: number }[];
  perSource: { label: string; count: number }[];
  perStatus: { name: string; value: number }[];
  busiestDates: { date: string; count: number }[];
  busiestTimes: { time: string; count: number }[];
}

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "Offen",
  CONFIRMED: "Bestätigt",
  SEATED: "Sitzt",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
  NO_SHOW: "No-Show",
};

export async function getAnalytics(period: AnalyticsPeriod, customFrom?: ISODate, customTo?: ISODate): Promise<AnalyticsResult> {
  const { from, to } = resolveRange(period, customFrom, customTo);
  const [current, areas] = await Promise.all([
    reservationRepository.findMany({ from, to }),
    seatingAreaRepository.findMany(),
  ]);

  const dayCount = Math.max(1, Math.round((+new Date(to) - +new Date(from)) / 86_400_000) + 1);
  const prevTo = format(subDays(new Date(from), 1), "yyyy-MM-dd");
  const prevFrom = format(subDays(new Date(from), dayCount), "yyyy-MM-dd");
  const previous = await reservationRepository.findMany({ from: prevFrom, to: prevTo });

  const completed = current.filter((r) => r.status === "COMPLETED").length;
  const cancelled = current.filter((r) => r.status === "CANCELLED").length;
  const noShow = current.filter((r) => r.status === "NO_SHOW").length;
  const expectedGuests = current
    .filter((r) => r.status !== "CANCELLED" && r.status !== "NO_SHOW")
    .reduce((s, r) => s + r.partySize, 0);

  const emailCounts = new Map<string, number>();
  for (const r of current) emailCounts.set(r.customer.email, (emailCounts.get(r.customer.email) ?? 0) + 1);
  const estimatedReturningCustomers = [...emailCounts.values()].filter((n) => n > 1).length;

  const perDay: { date: string; count: number }[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = format(subDays(new Date(to), i), "yyyy-MM-dd");
    perDay.push({ date: d.slice(5), count: current.filter((r) => r.date === d).length });
  }

  const perWeekday = WEEKDAY_LABELS.map((label, i) => ({
    label,
    count: current.filter((r) => new Date(r.date).getDay() === i).length,
  }));

  const perHour = Array.from({ length: 24 }, (_, h) => ({
    label: `${h}h`,
    count: current.filter((r) => Number.parseInt(r.time, 10) === h).length,
  })).filter((h) => h.count > 0);

  const perSeatingArea = areas.map((a) => ({
    label: a.name,
    count: current.filter((r) => r.seatingAreaId === a.id).length,
  }));

  const bySource = new Map<string, number>();
  for (const r of current) bySource.set(r.source, (bySource.get(r.source) ?? 0) + 1);
  const perSource = [...bySource.entries()].map(([label, count]) => ({ label, count }));

  const perStatus = (Object.keys(STATUS_LABEL) as ReservationStatus[])
    .map((s) => ({ name: STATUS_LABEL[s], value: current.filter((r) => r.status === s).length }))
    .filter((s) => s.value > 0);

  const byDate = new Map<string, number>();
  for (const r of current) byDate.set(r.date, (byDate.get(r.date) ?? 0) + 1);
  const busiestDates = [...byDate.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const byTime = new Map<string, number>();
  for (const r of current) byTime.set(r.time, (byTime.get(r.time) ?? 0) + 1);
  const busiestTimes = [...byTime.entries()]
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const deltaPct = previous.length > 0 ? Math.round(((current.length - previous.length) / previous.length) * 100) : null;

  return {
    range: { from, to },
    totals: {
      reservations: current.length,
      expectedGuests,
      averagePartySize: current.length ? Math.round((expectedGuests / current.length) * 10) / 10 : 0,
      pending: current.filter((r) => r.status === "PENDING").length,
      confirmed: current.filter((r) => r.status === "CONFIRMED").length,
      completed,
      cancelled,
      noShow,
      noShowRate: current.length ? Math.round((noShow / current.length) * 1000) / 10 : 0,
      estimatedReturningCustomers,
    },
    previousPeriod: { reservations: previous.length, deltaPct },
    perDay,
    perWeekday,
    perHour,
    perSeatingArea,
    perSource,
    perStatus,
    busiestDates,
    busiestTimes,
  };
}
