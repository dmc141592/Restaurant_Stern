"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/staff/permission-gate";
import { userRepository, invitationRepository } from "@/repositories/user-repository";
import type { User, UserRole } from "@/types";

// FUTURE REPLACEMENT POINT: every action here becomes a Server Action that
// re-checks user.deactivate.*/user.role.change server-side (see
// lib/permissions.ts) and writes an AuditLog entry — never trust the
// PermissionGate below alone.
export function TeamMemberActions({ member, currentRole }: { member: User; currentRole: UserRole }) {
  const router = useRouter();

  async function deactivate() {
    await userRepository.deactivate(member.id);
    toast.success(`${member.firstName} deaktiviert`);
    router.refresh();
  }
  async function reactivate() {
    await userRepository.activate(member.id);
    toast.success(`${member.firstName} reaktiviert`);
    router.refresh();
  }
  async function toggleRole() {
    const nextRole: UserRole = member.role === "MANAGER" ? "EMPLOYEE" : "MANAGER";
    await userRepository.updateRole(member.id, nextRole);
    toast.success(`Rolle geändert zu ${nextRole === "MANAGER" ? "Manager" : "Mitarbeiter"}`);
    router.refresh();
  }
  async function revokeInvitation() {
    await invitationRepository.revoke(member.id);
    toast.success("Einladung widerrufen");
    router.refresh();
  }

  const deactivatePerm = member.role === "MANAGER" ? "user.deactivate.manager" : "user.deactivate.employee";

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {member.status === "INVITED" && member.invitationStatus === "PENDING" && (
        <PermissionGate role={currentRole} perm={deactivatePerm}>
          <Button variant="ghost" size="sm" onClick={revokeInvitation}>
            Einladung widerrufen
          </Button>
        </PermissionGate>
      )}
      {member.role !== "ADMIN" && (
        <PermissionGate role={currentRole} perm="user.role.change">
          <Button variant="ghost" size="sm" onClick={toggleRole}>
            {member.role === "MANAGER" ? "Zu Mitarbeiter machen" : "Zu Manager befördern"}
          </Button>
        </PermissionGate>
      )}
      {member.role !== "ADMIN" &&
        (member.status === "DEACTIVATED" ? (
          <PermissionGate role={currentRole} perm={deactivatePerm}>
            <Button variant="ghost" size="sm" onClick={reactivate}>
              Reaktivieren
            </Button>
          </PermissionGate>
        ) : (
          member.status === "ACTIVE" && (
            <PermissionGate role={currentRole} perm={deactivatePerm}>
              <Button variant="ghost" size="sm" onClick={deactivate}>
                Deaktivieren
              </Button>
            </PermissionGate>
          )
        ))}
    </div>
  );
}
