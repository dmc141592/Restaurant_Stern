// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace the in-memory implementation with a Prisma
// query (`prisma.event.findMany({ where: { visibility: "PUBLIC", status: "PUBLISHED", deletedAt: null } })`).
// Keep the method signature stable so the swap is a drop-in replacement.

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
};
