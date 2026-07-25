// Composition layer over multiple repositories. Kept separate from
// reservationRepository so that repository stays a plain per-entity
// interface (clean 1:1 mapping to a future Prisma model) while this file
// owns the cross-entity aggregation.
//
// TODO (migration): becomes a Prisma aggregate/groupBy query, or a
// database view, once there's a real database.

import { reservationRepository } from "@/repositories/reservation-repository";
import { eventRepository } from "@/repositories/event-repository";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import type { ISODate } from "@/types";

export interface DashboardStatistics {
  todayCount: number;
  expectedGuestsToday: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  noShowCount: number;
  upcomingEvents: number;
  availableCapacityToday: number;
}

export async function getDashboardStatistics(date: ISODate): Promise<DashboardStatistics> {
  const [base, events, areas] = await Promise.all([
    reservationRepository.getStatistics(date),
    eventRepository.findMany(),
    seatingAreaRepository.findMany(),
  ]);

  const upcomingEvents = events.filter((e) => e.status === "PUBLISHED" && e.startDate >= date).length;
  const availableCapacityToday =
    areas.filter((a) => a.currentlyOpen).reduce((s, a) => s + a.capacity, 0) - base.expectedGuestsToday;

  return { ...base, upcomingEvents, availableCapacityToday };
}
