import type { UserRole } from "@/types";

// NOTE: These checks are for UX only. In production, every action must be
// re-verified server-side inside Next.js Server Actions / Route Handlers with
// the Auth.js session, and enforced by PostgreSQL row policies via Prisma.

export type Permission =
  | "reservation.view"
  | "reservation.edit"
  | "reservation.status"
  | "reservation.note"
  | "reservation.softDelete"
  | "reservation.restore"
  | "reservation.hardDelete"
  | "event.view"
  | "event.create"
  | "event.edit"
  | "event.softDelete"
  | "event.restore"
  | "user.invite.employee"
  | "user.invite.manager"
  | "user.deactivate.employee"
  | "user.deactivate.manager"
  | "user.role.change"
  | "seating.manage"
  | "opening.manage"
  | "analytics.view"
  | "analytics.export"
  | "audit.viewAll"
  | "audit.viewOperational"
  | "settings.manage";

const MATRIX: Record<UserRole, Permission[]> = {
  EMPLOYEE: [
    "reservation.view",
    "reservation.edit",
    "reservation.status",
    "reservation.note",
    "event.view",
    "event.create",
    "event.edit",
    "analytics.view",
  ],
  MANAGER: [
    "reservation.view",
    "reservation.edit",
    "reservation.status",
    "reservation.note",
    "reservation.softDelete",
    "reservation.restore",
    "event.view",
    "event.create",
    "event.edit",
    "event.softDelete",
    "event.restore",
    "user.invite.employee",
    "user.deactivate.employee",
    "seating.manage",
    "opening.manage",
    "analytics.view",
    "analytics.export",
    "audit.viewOperational",
  ],
  ADMIN: [
    "reservation.view",
    "reservation.edit",
    "reservation.status",
    "reservation.note",
    "reservation.softDelete",
    "reservation.restore",
    "reservation.hardDelete",
    "event.view",
    "event.create",
    "event.edit",
    "event.softDelete",
    "event.restore",
    "user.invite.employee",
    "user.invite.manager",
    "user.deactivate.employee",
    "user.deactivate.manager",
    "user.role.change",
    "seating.manage",
    "opening.manage",
    "analytics.view",
    "analytics.export",
    "audit.viewAll",
    "settings.manage",
  ],
};

export function can(role: UserRole | undefined, perm: Permission): boolean {
  if (!role) return false;
  return MATRIX[role].includes(perm);
}

export function roleLabel(role: UserRole): string {
  return role === "ADMIN" ? "Administrator" : role === "MANAGER" ? "Manager" : "Mitarbeiter";
}

export const PERMISSION_MATRIX = MATRIX;
