import type { Metadata } from "next";
import { StaffShell } from "@/components/staff/staff-shell";
import { TeamInviteDialog } from "@/components/staff/team-invite-dialog";
import { TeamMemberActions } from "@/components/staff/team-member-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireDemoSession } from "@/lib/demo-session";
import { can, roleLabel } from "@/lib/permissions";
import { userRepository } from "@/repositories/user-repository";
import { notificationRepository } from "@/repositories/notification-repository";
import type { UserRole } from "@/types";

export const metadata: Metadata = {
  title: "Team – Sternen Portal",
  description: "Mitarbeitende und Rollen verwalten.",
};

export default async function TeamPage() {
  const { user } = await requireDemoSession();

  const [members, notifications] = await Promise.all([userRepository.findMany(), notificationRepository.findAll()]);

  const invitableRoles: UserRole[] = can(user.role, "user.invite.manager")
    ? ["EMPLOYEE", "MANAGER"]
    : can(user.role, "user.invite.employee")
      ? ["EMPLOYEE"]
      : [];

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Team"
      description="Mitarbeitende, Einladungen und Rollen"
      actions={invitableRoles.length > 0 ? <TeamInviteDialog invitableRoles={invitableRoles} /> : undefined}
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Einladung</TableHead>
                <TableHead>Letzte Anmeldung</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    {m.firstName} {m.lastName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                  <TableCell>{roleLabel(m.role)}</TableCell>
                  <TableCell>
                    {m.status === "ACTIVE" && <Badge>Aktiv</Badge>}
                    {m.status === "INVITED" && <Badge variant="secondary">Eingeladen</Badge>}
                    {m.status === "DEACTIVATED" && <Badge variant="outline">Deaktiviert</Badge>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.invitationStatus === "PENDING" && "Ausstehend"}
                    {m.invitationStatus === "ACCEPTED" && "Angenommen"}
                    {m.invitationStatus === "EXPIRED" && "Abgelaufen"}
                    {m.invitationStatus === "REVOKED" && "Widerrufen"}
                    {!m.invitationStatus && "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{m.lastLoginAt?.slice(0, 10) ?? "—"}</TableCell>
                  <TableCell>
                    <TeamMemberActions member={m} currentRole={user.role} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </StaffShell>
  );
}
