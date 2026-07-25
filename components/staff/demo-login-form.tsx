"use client";

// DEMO-ONLY — delete this file when Auth.js is introduced.
//
// This is a role *preview* picker, not a login form. There is no password
// field and nothing here simulates a real credential check — selecting a
// role just writes an id to a cookie (see lib/demo-session-shared.ts /
// lib/demo-session.ts) so the rest of the staff portal can be previewed
// under that role while it's being built.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roleLabel } from "@/lib/permissions";
import { DEMO_SESSION_COOKIE } from "@/lib/demo-session-shared";
import type { User, UserRole } from "@/types";

const ROLE_ORDER: UserRole[] = ["EMPLOYEE", "MANAGER", "ADMIN"];

export function DemoLoginForm({ users }: { users: User[] }) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("MANAGER");
  const [pending, setPending] = useState(false);

  const usersByRole = Object.fromEntries(ROLE_ORDER.map((r) => [r, users.find((u) => u.role === r)])) as Record<
    UserRole,
    User | undefined
  >;

  function enterPreview() {
    const user = usersByRole[role];
    if (!user) return;
    setPending(true);
    document.cookie = `${DEMO_SESSION_COOKIE}=${user.id}; path=/; max-age=28800; samesite=lax`;
    router.push("/staff/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-dashed border-border bg-muted/40 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <AlertTriangle className="h-3.5 w-3.5" />
          Design-/Demo-Vorschau — keine echte Anmeldung
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Es gibt kein Passwort und keine echte Sitzung. Wählen Sie eine Rolle, um die Oberfläche in dieser Ansicht
          zu prüfen. Die produktive Version wird durch Auth.js mit echten Konten ersetzt.
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-foreground">Rolle zur Vorschau wählen</legend>
        <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="gap-3">
          {ROLE_ORDER.map((r) => {
            const user = usersByRole[r];
            return (
              <Label
                key={r}
                htmlFor={`role-${r}`}
                className="flex cursor-pointer items-center justify-between rounded-md border border-input p-3 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10"
              >
                <span>
                  <span className="block font-medium">{roleLabel(r)}</span>
                  {user && <span className="text-xs text-muted-foreground">{user.firstName} {user.lastName}</span>}
                </span>
                <RadioGroupItem id={`role-${r}`} value={r} />
              </Label>
            );
          })}
        </RadioGroup>
      </fieldset>

      <Button size="lg" className="w-full" disabled={pending || !usersByRole[role]} onClick={enterPreview}>
        {pending ? "Öffne Vorschau…" : `Als ${roleLabel(role)} vorschauen`}
      </Button>

      <p className="text-xs text-muted-foreground">
        Neue Konten werden über Einladungen erstellt. Bitte kontaktieren Sie die Geschäftsleitung.
      </p>
    </div>
  );
}
