"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABELS } from "@/components/staff/status-badge";
import { reservationRepository } from "@/repositories/reservation-repository";
import type { ReservationStatus } from "@/types";

// Mock-only mutation: calls the in-memory repository directly, then asks
// Next.js to re-render the current route from the server so the change is
// reflected everywhere (stats, lists). FUTURE REPLACEMENT POINT: becomes a
// Server Action with a server-side permission re-check before the status
// change is applied.
export function QuickStatusSelect({
  reservationId,
  status,
}: {
  reservationId: string;
  status: ReservationStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(status);

  async function onChange(next: string) {
    const nextStatus = next as ReservationStatus;
    setValue(nextStatus);
    try {
      await reservationRepository.updateStatus(reservationId, nextStatus);
      toast.success("Status aktualisiert");
      startTransition(() => router.refresh());
    } catch {
      setValue(status);
      toast.error("Status konnte nicht aktualisiert werden.");
    }
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={pending}>
      <SelectTrigger
        className="h-8 w-36 text-xs"
        aria-label="Status ändern"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABELS[s].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
