// Repository layer. Page/feature code MUST go through this interface.
//
// `userRepository` and `invitationRepository` share one in-memory array
// (invitations are modeled as a status on the User record here, matching the
// original prototype's data model) so the two stay consistent with each
// other without a real database.
//
// TODO (migration): replace with Prisma queries against User/Invitation
// tables. Every mutation here becomes a Server Action that:
//   1. Re-checks the acting user's permission server-side (user.invite.*,
//      user.deactivate.*, user.role.change — see lib/permissions.ts).
//   2. Sends a real invitation email with a secure, expiring, single-use link
//      (see the 5-step flow described in the team page).
//   3. Writes an AuditLog entry (USER_INVITED / USER_ROLE_CHANGED /
//      USER_DEACTIVATED).
// None of that exists yet — every action below just mutates an array.

import type { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const users: User[] = [...mockUsers];

export const userRepository = {
  async findMany(): Promise<User[]> {
    await tick();
    return [...users];
  },
  async findById(id: string): Promise<User | undefined> {
    await tick();
    return users.find((u) => u.id === id);
  },
  async invite(input: { firstName: string; lastName: string; email: string; role: UserRole }): Promise<User> {
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
  async updateRole(id: string, role: UserRole): Promise<User> {
    await tick();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) throw new Error("User not found");
    users[i] = { ...users[i], role };
    return users[i];
  },
  async activate(id: string): Promise<User> {
    await tick();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) throw new Error("User not found");
    users[i] = { ...users[i], status: "ACTIVE" };
    return users[i];
  },
  async deactivate(id: string): Promise<User> {
    await tick();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) throw new Error("User not found");
    users[i] = { ...users[i], status: "DEACTIVATED" };
    return users[i];
  },
};

export const invitationRepository = {
  async revoke(userId: string): Promise<User> {
    await tick();
    const i = users.findIndex((u) => u.id === userId);
    if (i < 0) throw new Error("User not found");
    users[i] = { ...users[i], invitationStatus: "REVOKED" };
    return users[i];
  },
};
