import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { StaffShell } from "@/components/staff/staff-shell";
import { NotificationPreferences } from "@/components/staff/notification-preferences";
import { AuditLogList } from "@/components/staff/audit-log-list";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireDemoSession } from "@/lib/demo-session";
import { can, roleLabel, PERMISSION_MATRIX } from "@/lib/permissions";
import { auditLogRepository } from "@/repositories/audit-log-repository";
import { notificationRepository } from "@/repositories/notification-repository";
import type { UserRole } from "@/types";

export const metadata: Metadata = {
  title: "Einstellungen – Sternen Portal",
  description: "Systemeinstellungen und Berechtigungsmatrix.",
};

export default async function SettingsPage() {
  const { user } = await requireDemoSession();
  const notifications = await notificationRepository.findAll();

  const roles: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN"];
  const allPerms = Array.from(new Set(roles.flatMap((r) => PERMISSION_MATRIX[r]))).sort();

  const canSeeAudit = can(user.role, "audit.viewAll") || can(user.role, "audit.viewOperational");
  const auditLogs = canSeeAudit
    ? can(user.role, "audit.viewAll")
      ? await auditLogRepository.findAll()
      : await auditLogRepository.findOperational()
    : [];

  return (
    <StaffShell user={user} notifications={notifications} title="Einstellungen" description="Profil, Berechtigungen und System">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl">Ihr Profil</h2>
            <div className="mt-4 grid gap-3">
              <div>
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" value={`${user.firstName} ${user.lastName}`} disabled />
              </div>
              <div>
                <Label htmlFor="profile-email">E-Mail</Label>
                <Input id="profile-email" value={user.email} disabled />
              </div>
              <div>
                <Label htmlFor="profile-role">Rolle</Label>
                <Input id="profile-role" value={`${roleLabel(user.role)} · Demo-Vorschau`} disabled />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Profilbearbeitung ist in diesem Prototyp nicht verfügbar — Konten werden künftig über Auth.js verwaltet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl">Benachrichtigungen</h2>
            <div className="mt-4">
              <NotificationPreferences />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="font-serif text-xl">Restaurant- &amp; Systemeinstellungen</h2>
          {can(user.role, "settings.manage") ? (
            <div className="mt-3 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              Restaurant-Stammdaten, Buchungsregeln und System-Feineinstellungen werden im nächsten Schritt
              implementiert.
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nur Administratoren können System- und Restaurant-Einstellungen verwalten.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="font-serif text-xl">Berechtigungsmatrix</h2>
          <p className="text-xs text-muted-foreground">
            Frontend-Ansicht zur Referenz. Echte Durchsetzung erfolgt später in Server Actions und Datenbank.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-4">Berechtigung</th>
                  {roles.map((r) => (
                    <th key={r} className="px-3 py-2 text-center">
                      {roleLabel(r)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPerms.map((p) => (
                  <tr key={p} className="border-b border-border/70">
                    <td className="py-2 pr-4 font-mono text-xs">{p}</td>
                    {roles.map((r) => (
                      <td key={r} className="px-3 text-center">
                        {PERMISSION_MATRIX[r].includes(p) ? (
                          <Check className="mx-auto h-4 w-4 text-primary" aria-label="Erlaubt" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="Nicht erlaubt" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {canSeeAudit && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="font-serif text-xl">Audit-Log</h2>
            <p className="text-xs text-muted-foreground">
              {can(user.role, "audit.viewAll")
                ? "Vollständiges Protokoll aller Aktionen (Administrator-Ansicht)."
                : "Betriebliche Aktionen (Manager-Ansicht) — Konten-/Rollenänderungen sind nur für Administratoren sichtbar."}
            </p>
            <div className="mt-4">
              <AuditLogList logs={auditLogs} />
            </div>
          </CardContent>
        </Card>
      )}
    </StaffShell>
  );
}
