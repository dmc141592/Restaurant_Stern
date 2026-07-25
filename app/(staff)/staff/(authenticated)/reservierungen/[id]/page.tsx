import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { StaffShell } from "@/components/staff/staff-shell";
import { StatusBadge } from "@/components/staff/status-badge";
import { CopyButton } from "@/components/staff/copy-button";
import { ReservationNotesPanel } from "@/components/staff/reservation-notes-panel";
import { ReservationActionsPanel } from "@/components/staff/reservation-actions-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireDemoSession } from "@/lib/demo-session";
import { reservationRepository } from "@/repositories/reservation-repository";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import { userRepository } from "@/repositories/user-repository";
import { notificationRepository } from "@/repositories/notification-repository";

export const metadata: Metadata = {
  title: "Reservation – Sternen Portal",
  description: "Detailansicht einer Reservation.",
};

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireDemoSession();

  const reservation = await reservationRepository.findById(id);
  if (!reservation) notFound();

  const [notes, seatingAreas, assignedEmployee, notifications] = await Promise.all([
    reservationRepository.listNotesFor(reservation.id),
    seatingAreaRepository.findMany(),
    reservation.assignedEmployeeId ? userRepository.findById(reservation.assignedEmployeeId) : Promise.resolve(undefined),
    notificationRepository.findAll(),
  ]);

  const area = seatingAreas.find((a) => a.id === reservation.seatingAreaId);

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title={`Reservation ${reservation.reservationNumber}`}
      description={`${reservation.date} · ${reservation.time} · ${reservation.partySize} Personen`}
    >
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/staff/reservierungen">
          <ArrowLeft className="mr-1 h-4 w-4" /> Zurück zur Übersicht
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl">
                    {reservation.customer.firstName} {reservation.customer.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{reservation.reservationNumber}</p>
                </div>
                <StatusBadge status={reservation.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Datum" value={reservation.date} />
                <Field label="Zeit" value={reservation.time} />
                <Field label="Personen" value={String(reservation.partySize)} />
                <Field label="Bereich" value={area?.name ?? "—"} />
                <Field label="Anlass" value={reservation.occasion} />
                <Field label="Quelle" value={reservation.source} />
                <Field label="Zuständige Person" value={assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : "—"} />
              </div>

              <div className="mt-6 rounded-md bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Kontakt</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a className="hover:underline" href={`mailto:${reservation.customer.email}`}>
                      {reservation.customer.email}
                    </a>
                    <CopyButton text={reservation.customer.email} label="E-Mail kopieren" />
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a className="hover:underline" href={`tel:${reservation.customer.phone}`}>
                      {reservation.customer.phone}
                    </a>
                    <CopyButton text={reservation.customer.phone} label="Telefon kopieren" />
                  </p>
                </div>
              </div>

              {reservation.message && (
                <div className="mt-4 rounded-md border border-border p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Mitteilung des Gastes</p>
                  <p className="mt-2 text-sm">{reservation.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl">Interne Notizen</h3>
              <p className="text-xs text-muted-foreground">Nicht sichtbar für Gäste.</p>
              <ReservationNotesPanel
                reservationId={reservation.id}
                notes={notes}
                authorId={user.id}
                authorName={`${user.firstName} ${user.lastName}`}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl">Aktionen</h3>
              <ReservationActionsPanel reservation={reservation} seatingAreas={seatingAreas} role={user.role} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl">Verlauf</h3>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>Erstellt {new Date(reservation.createdAt).toLocaleString("de-CH")}</li>
                <li>Aktualisiert {new Date(reservation.updatedAt).toLocaleString("de-CH")}</li>
                {reservation.deletedAt && <li>Gelöscht {new Date(reservation.deletedAt).toLocaleString("de-CH")}</li>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
