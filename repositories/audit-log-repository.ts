// Repository layer. Page/feature code MUST go through this interface.
//
// TODO (migration): replace with a Prisma query against an AuditLog table
// (`prisma.auditLog.findMany({ where: { entityType, entityId }, orderBy: { createdAt: "desc" } })`).
// Every future Server Action mutation should write one row here — inside the
// SAME database transaction as the data change it describes, so the two can
// never drift apart — before triggering any follow-up notification/email.
// None of that exists yet; this is read-only seeded demo data.

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
  /** Full change history for one record — powers the admin-only timeline on detail pages. */
  async findByEntity(entityType: AuditLog["entityType"], entityId: string): Promise<AuditLog[]> {
    await tick();
    return logs
      .filter((l) => l.entityType === entityType && l.entityId === entityId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  /** Recent cross-entity activity — powers the dashboard activity feed. */
  async findRecent(limit: number, options?: { includeUserEntity?: boolean }): Promise<AuditLog[]> {
    await tick();
    return logs
      .filter((l) => options?.includeUserEntity || l.entityType !== "User")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },
};
