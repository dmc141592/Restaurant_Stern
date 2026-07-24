// Repository layer. Page/feature code MUST go through this interface.
//
// Public-facing demo submission only. This in-memory array is not
// persistence: it resets on every server restart / cold start, and each
// server/client bundle gets its own independent copy. It exists purely so
// the public reservation form has something real to call during this phase.
//
// ---------------------------------------------------------------------
// FUTURE REPLACEMENT POINT (do not ship this file's `create` to production):
//   1. Move this call behind a Next.js Server Action.
//   2. Re-validate the payload server-side with the same Zod schema used in
//      the form — client-side validation is a UX nicety only, never the
//      security/data-integrity boundary.
//   3. Wrap the write in a Prisma transaction (create/find the Customer,
//      create the Reservation, write an AuditLog entry).
//   4. Persist to Neon PostgreSQL via Prisma.
//   5. Trigger a confirmation email to the guest and a notification to staff.
// ---------------------------------------------------------------------

import type { Reservation } from "@/types";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const reservations: Reservation[] = [];

export interface ReservationRepository {
  create(
    input: Omit<Reservation, "id" | "reservationNumber" | "createdAt" | "updatedAt" | "status"> & {
      status?: Reservation["status"];
    },
  ): Promise<Reservation>;
}

export const reservationRepository: ReservationRepository = {
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
};
