"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, RotateCcw, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PermissionGate } from "@/components/staff/permission-gate";
import { STATUS_LABELS } from "@/components/staff/status-badge";
import { reservationRepository } from "@/repositories/reservation-repository";
import type { Reservation, ReservationStatus, SeatingArea, UserRole } from "@/types";

// FUTURE REPLACEMENT POINT: every mutation below becomes a Server Action
// that re-checks `can(session.role, "reservation.*")` server-side before
// touching Prisma — the PermissionGate below only hides the button in the UI.
export function ReservationActionsPanel({
  reservation,
  seatingAreas,
  role,
}: {
  reservation: Reservation;
  seatingAreas: SeatingArea[];
  role: UserRole;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function updateStatus(status: ReservationStatus) {
    setPending(true);
    try {
      await reservationRepository.updateStatus(reservation.id, status);
      toast.success("Status aktualisiert");
      router.refresh();
    } catch {
      toast.error("Status konnte nicht aktualisiert werden.");
    } finally {
      setPending(false);
    }
  }

  async function assignArea(seatingAreaId: string) {
    setPending(true);
    try {
      await reservationRepository.update(reservation.id, { seatingAreaId });
      router.refresh();
    } catch {
      toast.error("Bereich konnte nicht zugewiesen werden.");
    } finally {
      setPending(false);
    }
  }

  async function softDelete() {
    await reservationRepository.softDelete(reservation.id);
    toast.success("Gelöscht");
    router.refresh();
  }

  async function restore() {
    await reservationRepository.restore(reservation.id);
    toast.success("Wiederhergestellt");
    router.refresh();
  }

  async function hardDelete() {
    await reservationRepository.hardDelete(reservation.id);
    toast.success("Endgültig gelöscht");
    router.push("/staff/reservierungen");
  }

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="mb-1 text-xs text-muted-foreground">Status ändern</p>
        <Select value={reservation.status} onValueChange={(v) => updateStatus(v as ReservationStatus)} disabled={pending}>
          <SelectTrigger aria-label="Reservationsstatus ändern">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="mb-1 text-xs text-muted-foreground">Sitzbereich</p>
        <Select
          value={reservation.seatingAreaId ?? ""}
          onValueChange={assignArea}
          disabled={pending}
        >
          <SelectTrigger aria-label="Sitzbereich zuweisen">
            <SelectValue placeholder="Bereich zuweisen" />
          </SelectTrigger>
          <SelectContent>
            {seatingAreas.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {reservation.status !== "CANCELLED" && (
        <Button variant="outline" className="w-full" disabled={pending} onClick={() => updateStatus("CANCELLED")}>
          <Ban className="mr-2 h-4 w-4" /> Reservation stornieren
        </Button>
      )}

      {reservation.deletedAt ? (
        <PermissionGate role={role} perm="reservation.restore">
          <Button variant="outline" className="w-full" onClick={restore}>
            <RotateCcw className="mr-2 h-4 w-4" /> Wiederherstellen
          </Button>
        </PermissionGate>
      ) : (
        <PermissionGate role={role} perm="reservation.softDelete">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Reservation löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reservation wirklich löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Die Reservation wird als gelöscht markiert und kann später wiederhergestellt werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={softDelete}>Löschen</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PermissionGate>
      )}

      <PermissionGate role={role} perm="reservation.hardDelete">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full border border-destructive bg-transparent text-destructive hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Endgültig löschen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Endgültig und unwiderruflich löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                Anders als „Löschen“ kann diese Aktion NICHT rückgängig gemacht werden — auch nicht von einem
                Administrator. Alle Daten dieser Reservation gehen dauerhaft verloren.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={hardDelete}>Endgültig löschen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PermissionGate>
    </div>
  );
}
