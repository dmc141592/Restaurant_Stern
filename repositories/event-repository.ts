// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace the in-memory implementation with Prisma queries.
// `findPublic` -> `prisma.event.findMany({ where: { visibility: "PUBLIC", status: "PUBLISHED", deletedAt: null } })`.
// Mutations must move behind Server Actions with server-side permission
// re-checks (see lib/permissions.ts) and AuditLog writes — never trust the
// client-side PermissionGate alone.

import type { RestaurantEvent } from "@/types";
import { mockEvents } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const events: RestaurantEvent[] = [...mockEvents];

export const eventRepository = {
  async findPublic(): Promise<RestaurantEvent[]> {
    await tick();
    return events.filter((e) => !e.deletedAt && e.visibility === "PUBLIC" && e.status === "PUBLISHED");
  },
  async findMany(): Promise<RestaurantEvent[]> {
    await tick();
    return events.filter((e) => !e.deletedAt);
  },
  async findById(id: string): Promise<RestaurantEvent | undefined> {
    await tick();
    // Deliberately includes soft-deleted events so the detail page can still
    // show them (with a restore action) via their direct URL.
    return events.find((e) => e.id === id);
  },
  async create(input: Omit<RestaurantEvent, "id" | "createdAt" | "updatedAt">): Promise<RestaurantEvent> {
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
  async update(id: string, patch: Partial<RestaurantEvent>): Promise<RestaurantEvent> {
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
  archive(id: string) {
    return this.update(id, { status: "ARCHIVED" });
  },
  async softDelete(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date().toISOString() });
  },
  async restore(id: string): Promise<void> {
    await this.update(id, { deletedAt: undefined });
  },
};
