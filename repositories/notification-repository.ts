// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace with a Prisma query scoped to the signed-in
// user/role, likely paired with a real-time channel for live updates.

import type { Notification } from "@/types";
import { mockNotifications } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const notifications: Notification[] = [...mockNotifications];

export const notificationRepository = {
  async findAll(): Promise<Notification[]> {
    await tick();
    return [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};
