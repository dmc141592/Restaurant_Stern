// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace with a Prisma query against an AuditLog table.
// Every future Server Action mutation should write one row here inside the
// same transaction as its data change — none of that exists yet, this is
// read-only seeded demo data.

import type { AuditLog } from "@/types";
import { mockAuditLogs } from "@/data/mock";

function tick() {
  return new Promise((r) => setTimeout(r, 60));
}

const logs: AuditLog[] = [...mockAuditLogs];

export const auditLogRepository = {
  /** ADMIN: every entry, including User-entity changes (invites, role changes). */
  async findAll(): Promise<AuditLog[]> {
    await tick();
    return [...logs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  /** MANAGER: operational entries only — excludes User-entity changes. */
  async findOperational(): Promise<AuditLog[]> {
    await tick();
    return logs
      .filter((l) => l.entityType !== "User")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};
