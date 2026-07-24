// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace with `prisma.seatingArea.findMany({ orderBy: { displayOrder: "asc" } })`.

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
};
