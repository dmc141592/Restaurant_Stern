"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, RotateCcw, Copy, Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { EventForm } from "@/components/staff/event-form";
import { eventRepository } from "@/repositories/event-repository";
import type { RestaurantEvent, UserRole } from "@/types";

export function EventDetailPanel({ event, role, userId }: { event: RestaurantEvent; role: UserRole; userId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  async function publish() {
    await eventRepository.publish(event.id);
    toast.success("Veröffentlicht");
    router.refresh();
  }
  async function hide() {
    await eventRepository.hide(event.id);
    toast.success("Ausgeblendet");
    router.refresh();
  }
  async function archive() {
    await eventRepository.archive(event.id);
    toast.success("Archiviert");
    router.refresh();
  }
  async function softDelete() {
    await eventRepository.softDelete(event.id);
    toast.success("Gelöscht");
    router.push("/staff/events");
  }
  async function restore() {
    await eventRepository.restore(event.id);
    toast.success("Wiederhergestellt");
    router.refresh();
  }
  async function duplicate() {
    const copy = await eventRepository.create({
      title: `${event.title} (Kopie)`,
      slug: `${event.slug}-kopie-${Date.now().toString(36)}`,
      shortDescription: event.shortDescription,
      fullDescription: event.fullDescription,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      capacity: event.capacity,
      bookingLink: event.bookingLink,
      reservationRequired: event.reservationRequired,
      visibility: event.visibility,
      status: "DRAFT",
      createdBy: userId,
      updatedBy: userId,
    });
    toast.success("Event dupliziert (als Entwurf)");
    router.push(`/staff/events/${copy.id}`);
  }

  if (editing) {
    return <EventForm mode="edit" event={event} userId={userId} onSaved={() => setEditing(false)} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Badge>{event.status}</Badge>
            <Badge variant="outline">{event.visibility === "PUBLIC" ? "Öffentlich" : "Nur Team"}</Badge>
          </div>
          <h2 className="mt-3 font-serif text-2xl">{event.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {event.startDate} {event.startTime} – {event.endDate} {event.endTime}
          </p>
          <p className="mt-4 text-sm">{event.fullDescription}</p>
          {event.capacity && <p className="mt-2 text-xs text-muted-foreground">Kapazität: {event.capacity} Personen</p>}
          {event.bookingLink && (
            <p className="mt-2 text-xs text-muted-foreground">
              Buchungslink:{" "}
              <a href={event.bookingLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                {event.bookingLink}
              </a>
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-serif text-lg">Aktionen</h3>
          {event.deletedAt ? (
            <PermissionGate role={role} perm="event.restore">
              <Button className="w-full" variant="outline" onClick={restore}>
                <RotateCcw className="mr-2 h-4 w-4" /> Wiederherstellen
              </Button>
            </PermissionGate>
          ) : (
            <>
              <Button className="w-full" variant="outline" onClick={() => setEditing(true)}>
                Bearbeiten
              </Button>
              <Button className="w-full" variant="outline" onClick={publish}>
                <Eye className="mr-2 h-4 w-4" /> Veröffentlichen
              </Button>
              <Button className="w-full" variant="outline" onClick={hide}>
                <EyeOff className="mr-2 h-4 w-4" /> Nicht mehr öffentlich
              </Button>
              <Button className="w-full" variant="outline" onClick={duplicate}>
                <Copy className="mr-2 h-4 w-4" /> Duplizieren
              </Button>
              {event.status !== "ARCHIVED" && (
                <Button className="w-full" variant="outline" onClick={archive}>
                  <Archive className="mr-2 h-4 w-4" /> Archivieren
                </Button>
              )}
              <PermissionGate role={role} perm="event.softDelete">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Event löschen
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Event wirklich löschen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Das Event wird als gelöscht markiert und kann später wiederhergestellt werden.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction onClick={softDelete}>Löschen</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </PermissionGate>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
