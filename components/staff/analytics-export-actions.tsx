"use client";

import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/staff/permission-gate";
import type { UserRole } from "@/types";

// Demo-only: no real CSV file is generated/downloaded and no print stylesheet
// is wired up. FUTURE REPLACEMENT POINT: a real export becomes a Route
// Handler (`/api/reservations/export.csv`) that streams a CSV built from a
// Prisma query, gated by analytics.export server-side.
export function AnalyticsExportActions({ role }: { role: UserRole }) {
  return (
    <div className="flex gap-2">
      <PermissionGate role={role} perm="analytics.export">
        <Button variant="outline" size="sm" onClick={() => toast.info("CSV-Export ist in diesem Prototyp nur eine Vorschau.")}>
          <Download className="mr-1 h-4 w-4" /> CSV
        </Button>
      </PermissionGate>
      <Button variant="outline" size="sm" onClick={() => toast.info("Druckansicht ist in diesem Prototyp nur eine Vorschau.")}>
        <Printer className="mr-1 h-4 w-4" /> Drucken
      </Button>
    </div>
  );
}
