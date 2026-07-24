import { createFileRoute } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { Card, CardContent } from "@/components/ui/card";
import { PERMISSION_MATRIX } from "@/lib/permissions";
import { Check, Minus } from "lucide-react";
import type { UserRole } from "@/types";

export const Route = createFileRoute("/staff/settings")({
  head: () => ({
    meta: [
      { title: "Einstellungen – Sternen Portal" },
      { name: "description", content: "Systemeinstellungen und Berechtigungsmatrix." },
      { property: "og:title", content: "Einstellungen – Sternen Portal" },
      { property: "og:description", content: "Systemeinstellungen und Rollen." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const roles: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN"];
  const allPerms = Array.from(new Set(roles.flatMap((r) => PERMISSION_MATRIX[r]))).sort();

  return (
    <StaffShell title="Einstellungen" description="Berechtigungen und System">
      <Card>
        <CardContent className="p-6">
          <h2 className="font-serif text-xl">Berechtigungsmatrix</h2>
          <p className="text-xs text-muted-foreground">Frontend-Ansicht zur Referenz. Echte Durchsetzung erfolgt später in Server Actions und Datenbank.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-4">Berechtigung</th>
                  {roles.map((r) => <th key={r} className="py-2 px-3 text-center">{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {allPerms.map((p) => (
                  <tr key={p} className="border-b border-border/70">
                    <td className="py-2 pr-4 font-mono text-xs">{p}</td>
                    {roles.map((r) => (
                      <td key={r} className="px-3 text-center">
                        {PERMISSION_MATRIX[r].includes(p) ? <Check className="mx-auto h-4 w-4 text-primary" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        Weitere Einstellungen (Restaurant-Stammdaten, Benachrichtigungen, Buchungsregeln) werden im nächsten Schritt implementiert.
      </div>
    </StaffShell>
  );
}
