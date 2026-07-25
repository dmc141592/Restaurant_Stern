// Repository layer. Page/feature code MUST go through this interface.
//
// In-memory only — resets on every server restart / cold start, and each
// server/client bundle gets its own independent copy of the array. Good
// enough to develop and demo the public reservation form and the staff
// portal's reservation management UI against; not persistence.
//
// ---------------------------------------------------------------------
// FUTURE REPLACEMENT POINT (do not ship this file's mutations to production):
//   1. Move every mutation (create/update/updateStatus/softDelete/restore/
//      hardDelete/addNote) behind a Next.js Server Action.
//   2. Re-validate payloads server-side with Zod — client-side validation is
//      a UX nicety only, never the security/data-integrity boundary.
//   3. Re-check the acting user's permission server-side with the Auth.js
//      session (see lib/permissions.ts) before every mutation — the
//      PermissionGate/`can()` checks in the UI are UX only.
//   4. Wrap writes in a Prisma transaction and write an AuditLog entry.
//   5. Persist to Neon PostgreSQL via Prisma.
//   6. Trigger confirmation/notification emails where relevant.
// ---------------------------------------------------------------------

import { mockReservations } from "@/data/mock";
import type { ISODate, Reservation, ReservationNote, ReservationStatus } from "@/types";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const reservations: Reservation[] = [...mockReservations];
const notes: ReservationNote[] = [];

export interface ReservationFilters {
  from?: ISODate;
  to?: ISODate;
  status?: ReservationStatus[];
  seatingAreaId?: string;
  source?: Reservation["source"];
  search?: string;
  includeDeleted?: boolean;
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
  create(
    input: Omit<Reservation, "id" | "reservationNumber" | "createdAt" | "updatedAt" | "status"> & {
      status?: ReservationStatus;
    },
  ): Promise<Reservation>;
  update(id: string, patch: Partial<Reservation>): Promise<Reservation>;
  updateStatus(id: string, status: ReservationStatus): Promise<Reservation>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  /** ADMIN only in the UI — irreversible even in this mock store. */
  hardDelete(id: string): Promise<void>;
  addNote(
    reservationId: string,
    note: Omit<ReservationNote, "id" | "createdAt" | "reservationId">,
  ): Promise<ReservationNote>;
  listNotesFor(reservationId: string): Promise<ReservationNote[]>;
  getStatistics(date: ISODate): Promise<ReservationStatistics>;
}

export const reservationRepository: ReservationRepository = {
  async findMany(filters) {
    await tick();
    return reservations.filter((r) => {
      if (r.deletedAt && !filters?.includeDeleted) return false;
      if (filters?.from && r.date < filters.from) return false;
      if (filters?.to && r.date > filters.to) return false;
      if (filters?.status && !filters.status.includes(r.status)) return false;
      if (filters?.seatingAreaId && r.seatingAreaId !== filters.seatingAreaId) return false;
      if (filters?.source && r.source !== filters.source) return false;
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
  async hardDelete(id) {
    await tick();
    const idx = reservations.findIndex((r) => r.id === id);
    if (idx >= 0) reservations.splice(idx, 1);
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
  async listNotesFor(reservationId) {
    await tick();
    return notes.filter((n) => n.reservationId === reservationId);
  },
  async getStatistics(date) {
    await tick();
    const day = reservations.filter((r) => !r.deletedAt && r.date === date);
    return {
      todayCount: day.length,
      expectedGuestsToday: day
        .filter((r) => r.status !== "CANCELLED" && r.status !== "NO_SHOW")
        .reduce((s, r) => s + r.partySize, 0),
      pendingCount: day.filter((r) => r.status === "PENDING").length,
      confirmedCount: day.filter((r) => r.status === "CONFIRMED").length,
      cancelledCount: day.filter((r) => r.status === "CANCELLED").length,
      noShowCount: day.filter((r) => r.status === "NO_SHOW").length,
      upcomingEvents: 0, // filled in by the caller from eventRepository — kept out of this repo to avoid a cross-entity dependency
      availableCapacityToday: 0, // filled in by the caller from seatingAreaRepository, same reason
    };
  },
};
