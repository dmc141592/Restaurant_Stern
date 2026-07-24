import { Badge } from "@/components/ui/badge";
import type { ReservationStatus } from "@/types";

const MAP: Record<ReservationStatus, { label: string; className: string }> = {
  PENDING: { label: "Offen", className: "bg-amber-100 text-amber-900 border-amber-200" },
  CONFIRMED: { label: "Bestätigt", className: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  SEATED: { label: "Sitzt", className: "bg-sky-100 text-sky-900 border-sky-200" },
  COMPLETED: { label: "Abgeschlossen", className: "bg-muted text-muted-foreground border-border" },
  CANCELLED: { label: "Storniert", className: "bg-rose-100 text-rose-900 border-rose-200" },
  NO_SHOW: { label: "No-Show", className: "bg-red-100 text-red-900 border-red-200" },
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const cfg = MAP[status];
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

export const STATUS_LABELS = MAP;
