"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { PermissionGate } from "@/components/staff/permission-gate";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import type { SeatingArea, UserRole } from "@/types";

export function SeatingAreaCard({
  area,
  role,
  futureReservationCount,
  prevArea,
  nextArea,
  currentUserId,
}: {
  area: SeatingArea;
  role: UserRole;
  futureReservationCount: number;
  prevArea?: SeatingArea;
  nextArea?: SeatingArea;
  currentUserId: string;
}) {
  const router = useRouter();
  const [confirmClose, setConfirmClose] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: area.name,
    description: area.description,
    capacity: area.capacity,
    minPartySize: area.minPartySize,
    maxPartySize: area.maxPartySize,
  });

  async function setOpenState(open: boolean) {
    if (!open && futureReservationCount > 0) {
      setConfirmClose(true);
      return;
    }
    await seatingAreaRepository.update(area.id, { currentlyOpen: open, updatedBy: currentUserId });
    router.refresh();
  }

  async function confirmCloseAnyway() {
    await seatingAreaRepository.update(area.id, { currentlyOpen: false, updatedBy: currentUserId });
    setConfirmClose(false);
    router.refresh();
  }

  async function togglePubliclyBookable(value: boolean) {
    await seatingAreaRepository.update(area.id, { publiclyBookable: value, updatedBy: currentUserId });
    router.refresh();
  }

  async function swapWith(neighbor: SeatingArea | undefined) {
    if (!neighbor) return;
    await Promise.all([
      seatingAreaRepository.update(area.id, { displayOrder: neighbor.displayOrder, updatedBy: currentUserId }),
      seatingAreaRepository.update(neighbor.id, { displayOrder: area.displayOrder, updatedBy: currentUserId }),
    ]);
    router.refresh();
  }

  async function saveEdit() {
    await seatingAreaRepository.update(area.id, { ...form, updatedBy: currentUserId });
    toast.success("Sitzbereich aktualisiert");
    setEditOpen(false);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl">{area.name}</h3>
            <p className="text-sm text-muted-foreground">{area.description}</p>
          </div>
          <PermissionGate
            role={role}
            perm="seating.manage"
            fallback={<Badge variant={area.currentlyOpen ? "default" : "secondary"}>{area.currentlyOpen ? "Offen" : "Zu"}</Badge>}
          >
            <Switch checked={area.currentlyOpen} onCheckedChange={setOpenState} aria-label={`${area.name} öffnen/schliessen`} />
          </PermissionGate>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <Stat label="Kapazität" value={area.capacity} />
          <Stat label="Min. Gruppe" value={area.minPartySize} />
          <Stat label="Max. Gruppe" value={area.maxPartySize} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <Badge variant={area.publiclyBookable ? "default" : "outline"}>
            {area.publiclyBookable ? "Online buchbar" : "Nur auf Anfrage"}
          </Badge>
          {futureReservationCount > 0 && (
            <Badge variant="outline" className="border-amber-300 text-amber-700">
              {futureReservationCount} zukünftige Reservationen
            </Badge>
          )}
        </div>

        <PermissionGate role={role} perm="seating.manage">
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => togglePubliclyBookable(!area.publiclyBookable)}>
              {area.publiclyBookable ? "Online-Buchung sperren" : "Online-Buchung erlauben"}
            </Button>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Bearbeiten
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{area.name} bearbeiten</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`name-${area.id}`}>Name</Label>
                    <Input id={`name-${area.id}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor={`desc-${area.id}`}>Beschreibung</Label>
                    <Input
                      id={`desc-${area.id}`}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`cap-${area.id}`}>Kapazität</Label>
                      <Input
                        id={`cap-${area.id}`}
                        type="number"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`min-${area.id}`}>Min.</Label>
                      <Input
                        id={`min-${area.id}`}
                        type="number"
                        value={form.minPartySize}
                        onChange={(e) => setForm({ ...form, minPartySize: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`max-${area.id}`}>Max.</Label>
                      <Input
                        id={`max-${area.id}`}
                        type="number"
                        value={form.maxPartySize}
                        onChange={(e) => setForm({ ...form, maxPartySize: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={saveEdit}>Speichern</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" disabled={!prevArea} aria-label="Nach oben verschieben" onClick={() => swapWith(prevArea)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={!nextArea} aria-label="Nach unten verschieben" onClick={() => swapWith(nextArea)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </PermissionGate>
      </CardContent>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bereich trotz bestehender Reservationen schliessen?</AlertDialogTitle>
            <AlertDialogDescription>
              {area.name} hat {futureReservationCount} zukünftige Reservation(en). Das Schliessen ändert diese
              Reservationen nicht automatisch — bitte betroffene Gäste separat informieren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseAnyway}>Trotzdem schliessen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/40 p-2 text-center">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-serif text-lg">{value}</p>
    </div>
  );
}
