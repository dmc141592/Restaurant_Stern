"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// UI-only placeholder — nothing here is persisted (no localStorage, no
// backend). Replace with a real per-user preferences table once Prisma
// exists.
const DEFAULT_PREFS = [
  { key: "newReservation", label: "Neue Reservation" },
  { key: "cancellation", label: "Stornierung" },
  { key: "largeGroup", label: "Grosse Gruppe" },
  { key: "customerMessage", label: "Gästemitteilung" },
  { key: "capacityWarning", label: "Kapazitätswarnung" },
  { key: "upcomingEvent", label: "Bevorstehendes Event" },
] as const;

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_PREFS.map((p) => [p.key, true])),
  );

  return (
    <div className="space-y-3">
      {DEFAULT_PREFS.map((p) => (
        <div key={p.key} className="flex items-center justify-between">
          <Label htmlFor={`pref-${p.key}`} className="text-sm font-normal">
            {p.label}
          </Label>
          <Switch
            id={`pref-${p.key}`}
            checked={prefs[p.key]}
            onCheckedChange={(v) => setPrefs((prev) => ({ ...prev, [p.key]: v }))}
          />
        </div>
      ))}
      <p className="pt-1 text-xs text-muted-foreground">
        Diese Einstellung ist eine Oberflächen-Vorschau und wird aktuell nicht gespeichert.
      </p>
    </div>
  );
}
