// Repository layer. Page/feature code MUST go through these interfaces.
//
// TODO (migration): replace mock implementations with Prisma queries inside
// Next.js Server Actions / Route Handlers. The public method signatures below
// are the contract — keep them stable during the swap.

import type {
  DailyOpeningHours,
  Reservation,
  ReservationNote,
  ReservationStatus,
  RestaurantEvent,
  SeatingArea,
  SpecialOpeningDate,
  User,
  UserRole,
  ISODate,
} from "@/types";
import {
  mockEvents,
  mockOpeningHours,
  mockReservations,
  mockSeatingAreas,
  mockSpecialDates,
  mockUsers,
} from "@/data/mock";

// -------- Reservations --------

export interface ReservationFilters {
  from?: ISODate;
  to?: ISODate;
  status?: ReservationStatus[];
  seatingAreaId?: string;
  search?: string;
}

export interface ReservationStatistics {
  todayCount: number;
  expectedGuestsToday: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  noShowCount: number;
  upcomingEvents: number;
  availableCapacityToday: number;
}

export interface ReservationRepository {
  findMany(filters?: ReservationFilters): Promise<Reservation[]>;
  findById(id: string): Promise<Reservation | undefined>;
  create(input: Omit<Reservation, "id" | "reservationNumber" | "createdAt" | "updatedAt" | "status"> & {
    status?: ReservationStatus;
  }): Promise<Reservation>;
  update(id: string, patch: Partial<Reservation>): Promise<Reservation>;
  updateStatus(id: string, status: ReservationStatus): Promise<Reservation>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  addNote(reservationId: string, note: Omit<ReservationNote, "id" | "createdAt" | "reservationId">): Promise<ReservationNote>;
  getStatistics(date: ISODate): Promise<ReservationStatistics>;
}

// In-memory demo store. NOT a database.
const reservations: Reservation[] = [...mockReservations];
const notes: ReservationNote[] = [];

export const reservationRepository: ReservationRepository = {
  async findMany(filters) {
    await tick();
    return reservations.filter((r) => {
      if (r.deletedAt) return false;
      if (filters?.from && r.date < filters.from) return false;
      if (filters?.to && r.date > filters.to) return false;
      if (filters?.status && !filters.status.includes(r.status)) return false;
      if (filters?.seatingAreaId && r.seatingAreaId !== filters.seatingAreaId) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const hay =
          `${r.customer.firstName} ${r.customer.lastName} ${r.customer.email} ${r.customer.phone} ${r.reservationNumber}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  },
  async findById(id) {
    await tick();
    return reservations.find((r) => r.id === id);
  },
  async create(input) {
    await tick();
    const n = reservations.length + 1;
    const r: Reservation = {
      ...input,
      id: crypto.randomUUID(),
      reservationNumber: `STA-2026-${String(500 + n).padStart(6, "0")}`,
      status: input.status ?? "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reservations.push(r);
    return r;
  },
  async update(id, patch) {
    await tick();
    const idx = reservations.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Reservation not found");
    reservations[idx] = { ...reservations[idx], ...patch, updatedAt: new Date().toISOString() };
    return reservations[idx];
  },
  async updateStatus(id, status) {
    return this.update(id, { status });
  },
  async softDelete(id) {
    await this.update(id, { deletedAt: new Date().toISOString() });
  },
  async restore(id) {
    await this.update(id, { deletedAt: undefined });
  },
  async addNote(reservationId, note) {
    await tick();
    const n: ReservationNote = {
      ...note,
      id: crypto.randomUUID(),
      reservationId,
      createdAt: new Date().toISOString(),
    };
    notes.push(n);
    return n;
  },
  async getStatistics(date) {
    await tick();
    const today = reservations.filter((r) => !r.deletedAt && r.date === date);
    return {
      todayCount: today.length,
      expectedGuestsToday: today
        .filter((r) => r.status !== "CANCELLED" && r.status !== "NO_SHOW")
        .reduce((s, r) => s + r.partySize, 0),
      pendingCount: today.filter((r) => r.status === "PENDING").length,
      confirmedCount: today.filter((r) => r.status === "CONFIRMED").length,
      cancelledCount: today.filter((r) => r.status === "CANCELLED").length,
      noShowCount: today.filter((r) => r.status === "NO_SHOW").length,
      upcomingEvents: mockEvents.filter((e) => e.status === "PUBLISHED" && e.startDate >= date).length,
      availableCapacityToday: mockSeatingAreas
        .filter((a) => a.currentlyOpen)
        .reduce((s, a) => s + a.capacity, 0) -
        today.reduce((s, r) => s + r.partySize, 0),
    };
  },
};

export function listNotesFor(reservationId: string): ReservationNote[] {
  return notes.filter((n) => n.reservationId === reservationId);
}

// -------- Events --------

const events: RestaurantEvent[] = [...mockEvents];

export const eventRepository = {
  async findMany(): Promise<RestaurantEvent[]> {
    await tick();
    return events.filter((e) => !e.deletedAt);
  },
  async findPublic(): Promise<RestaurantEvent[]> {
    await tick();
    return events.filter(
      (e) => !e.deletedAt && e.visibility === "PUBLIC" && e.status === "PUBLISHED",
    );
  },
  async findById(id: string) {
    await tick();
    return events.find((e) => e.id === id);
  },
  async create(input: Omit<RestaurantEvent, "id" | "createdAt" | "updatedAt">) {
    await tick();
    const e: RestaurantEvent = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    events.push(e);
    return e;
  },
  async update(id: string, patch: Partial<RestaurantEvent>) {
    await tick();
    const i = events.findIndex((e) => e.id === id);
    if (i < 0) throw new Error("Event not found");
    events[i] = { ...events[i], ...patch, updatedAt: new Date().toISOString() };
    return events[i];
  },
  publish(id: string) {
    return this.update(id, { status: "PUBLISHED" });
  },
  hide(id: string) {
    return this.update(id, { visibility: "STAFF_ONLY" });
  },
  softDelete(id: string) {
    return this.update(id, { deletedAt: new Date().toISOString() });
  },
  restore(id: string) {
    return this.update(id, { deletedAt: undefined });
  },
};

// -------- Users --------

const users: User[] = [...mockUsers];

export const userRepository = {
  async findMany(): Promise<User[]> {
    await tick();
    return [...users];
  },
  async findById(id: string) {
    await tick();
    return users.find((u) => u.id === id);
  },
  async invite(input: { firstName: string; lastName: string; email: string; role: UserRole }) {
    await tick();
    const u: User = {
      id: crypto.randomUUID(),
      ...input,
      status: "INVITED",
      invitationStatus: "PENDING",
      createdAt: new Date().toISOString(),
    };
    users.push(u);
    return u;
  },
  async updateRole(id: string, role: UserRole) {
    await tick();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) throw new Error("User not found");
    users[i] = { ...users[i], role };
    return users[i];
  },
  async activate(id: string) {
    const i = users.findIndex((u) => u.id === id);
    users[i] = { ...users[i], status: "ACTIVE" };
    return users[i];
  },
  async deactivate(id: string) {
    const i = users.findIndex((u) => u.id === id);
    users[i] = { ...users[i], status: "DEACTIVATED" };
    return users[i];
  },
};

// -------- Opening hours --------

const weekly: DailyOpeningHours[] = [...mockOpeningHours];
const special: SpecialOpeningDate[] = [...mockSpecialDates];

export const openingHoursRepository = {
  async getWeeklyHours() {
    await tick();
    return [...weekly].sort((a, b) => ((a.weekday + 6) % 7) - ((b.weekday + 6) % 7));
  },
  async updateWeeklyHours(next: DailyOpeningHours[]) {
    await tick();
    weekly.splice(0, weekly.length, ...next);
    return [...weekly];
  },
  async getSpecialDates() {
    await tick();
    return [...special];
  },
  async createSpecialDate(input: Omit<SpecialOpeningDate, "id">) {
    const s: SpecialOpeningDate = { ...input, id: crypto.randomUUID() };
    special.push(s);
    return s;
  },
  async updateSpecialDate(id: string, patch: Partial<SpecialOpeningDate>) {
    const i = special.findIndex((s) => s.id === id);
    special[i] = { ...special[i], ...patch };
    return special[i];
  },
  async deleteSpecialDate(id: string) {
    const i = special.findIndex((s) => s.id === id);
    if (i >= 0) special.splice(i, 1);
  },
};

// -------- Seating --------

const seatingAreas: SeatingArea[] = [...mockSeatingAreas];

export const seatingAreaRepository = {
  async findMany() {
    await tick();
    return [...seatingAreas].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async update(id: string, patch: Partial<SeatingArea>) {
    const i = seatingAreas.findIndex((s) => s.id === id);
    seatingAreas[i] = { ...seatingAreas[i], ...patch };
    return seatingAreas[i];
  },
};

// simulate async
function tick() {
  return new Promise((r) => setTimeout(r, 60));
}
