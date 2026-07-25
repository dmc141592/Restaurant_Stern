// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace with Prisma queries. Mutations must move behind
// Server Actions gated by seating.manage (see lib/permissions.ts), re-checked
// server-side — the client-side PermissionGate is UX only.

import type { SeatingArea } from "@/types";
import { mockSeatingAreas } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const seatingAreas: SeatingArea[] = [...mockSeatingAreas];

export const seatingAreaRepository = {
  async findMany(): Promise<SeatingArea[]> {
    await tick();
    return [...seatingAreas].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async findById(id: string): Promise<SeatingArea | undefined> {
    await tick();
    return seatingAreas.find((a) => a.id === id);
  },
  async update(id: string, patch: Partial<SeatingArea>): Promise<SeatingArea> {
    await tick();
    const i = seatingAreas.findIndex((a) => a.id === id);
    if (i < 0) throw new Error("Seating area not found");
    seatingAreas[i] = { ...seatingAreas[i], ...patch };
    return seatingAreas[i];
  },
  async create(input: Omit<SeatingArea, "id">): Promise<SeatingArea> {
    await tick();
    const a: SeatingArea = { ...input, id: crypto.randomUUID() };
    seatingAreas.push(a);
    return a;
  },
};
