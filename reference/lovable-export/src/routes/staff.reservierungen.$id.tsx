import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationRepository, listNotesFor } from "@/repositories";
import { mockSeatingAreas } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, STATUS_LABELS } from "@/components/staff/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PermissionGate } from "@/components/staff/PermissionGate";
import { useAuth } from "@/services/auth";
import type { ReservationStatus } from "@/types";
import { ArrowLeft, Copy, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/staff/reservierungen/$id")({
  head: () => ({
    meta: [
      { title: "Reservation – Sternen Portal" },
      { name: "description", content: "Detailansicht einer Reservation." },
      { property: "og:title", content: "Reservation – Sternen Portal" },
      { property: "og:description", content: "Detailansicht einer Reservation mit Notizen und Statusverwaltung." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = useParams({ from: "/staff/reservierungen/$id" });
  const qc = useQueryClient();
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const q = useQuery({ queryKey: ["res", id], queryFn: () => reservationRepository.findById(id) });
  const notes = q.data ? listNotesFor(q.data.id) : [];

  if (q.isLoading) return <StaffShell title="Reservation lädt…"><div className="h-64 animate-pulse rounded-lg bg-muted" /></StaffShell>;
  if (!q.data) return <StaffShell title="Nicht gefunden"><div className="rounded-lg border p-8 text-muted-foreground">Reservation nicht gefunden.</div></StaffShell>;

  const r = q.data;
  const area = mockSeatingAreas.find((a) => a.id === r.seatingAreaId);

  const refresh = () => qc.invalidateQueries({ queryKey: ["res"] });
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Kopiert"); };

  return (
    <StaffShell title={`Reservation ${r.reservationNumber}`} description={`${r.date} · ${r.time} · ${r.partySize} Personen`}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/staff/reservierungen"><ArrowLeft className="mr-1 h-4 w-4" /> Zurück zur Übersicht</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl">{r.customer.firstName} {r.customer.lastName}</h2>
                  <p className="text-sm text-muted-foreground">{r.reservationNumber}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Datum" value={r.date} />
                <Field label="Zeit" value={r.time} />
                <Field label="Personen" value={String(r.partySize)} />
                <Field label="Bereich" value={area?.name ?? "—"} />
                <Field label="Anlass" value={r.occasion} />
                <Field label="Quelle" value={r.source} />
              </div>

              <div className="mt-6 rounded-md bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Kontakt</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a className="hover:underline" href={`mailto:${r.customer.email}`}>{r.customer.email}</a>
                    <Button variant="ghost" size="icon" onClick={() => copy(r.customer.email)} aria-label="E-Mail kopieren"><Copy className="h-3.5 w-3.5" /></Button>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a className="hover:underline" href={`tel:${r.customer.phone}`}>{r.customer.phone}</a>
                    <Button variant="ghost" size="icon" onClick={() => copy(r.customer.phone)} aria-label="Telefon kopieren"><Copy className="h-3.5 w-3.5" /></Button>
                  </p>
                </div>
              </div>

              {r.message && (
                <div className="mt-4 rounded-md border border-border p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Mitteilung des Gastes</p>
                  <p className="mt-2 text-sm">{r.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl">Interne Notizen</h3>
              <p className="text-xs text-muted-foreground">Nicht sichtbar für Gäste.</p>
              <div className="mt-4 space-y-3">
                {notes.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Notizen.</p>}
                {notes.map((n) => (
                  <div key={n.id} className="rounded-md border border-border p-3 text-sm">
                    <p className="mb-1 text-xs text-muted-foreground">{n.authorName} · {new Date(n.createdAt).toLocaleString("de-CH")}</p>
                    <p>{n.body}</p>
                  </div>
                ))}
                <div className="pt-2">
                  <Textarea placeholder="Notiz hinzufügen…" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
                  <Button
                    className="mt-2"
                    disabled={!note.trim()}
                    onClick={async () => {
                      if (!user) return;
                      await reservationRepository.addNote(r.id, {
                        authorId: user.id,
                        authorName: `${user.firstName} ${user.lastName}`,
                        body: note,
                      });
                      setNote("");
                      refresh();
                      toast.success("Notiz gespeichert");
                    }}
                  >
                    Notiz speichern
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl">Aktionen</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Status ändern</p>
                  <Select
                    value={r.status}
                    onValueChange={async (v) => {
                      await reservationRepository.updateStatus(r.id, v as ReservationStatus);
                      refresh();
                      toast.success("Status aktualisiert");
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_LABELS[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Sitzbereich</p>
                  <Select
                    value={r.seatingAreaId ?? ""}
                    onValueChange={async (v) => {
                      await reservationRepository.update(r.id, { seatingAreaId: v });
                      refresh();
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Bereich zuweisen" /></SelectTrigger>
                    <SelectContent>
                      {mockSeatingAreas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <PermissionGate perm="reservation.softDelete">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full"><Trash2 className="mr-2 h-4 w-4" /> Reservation löschen</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reservation wirklich löschen?</AlertDialogTitle>
                        <AlertDialogDescription>Die Reservation wird als gelöscht markiert und kann später wiederhergestellt werden.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => { await reservationRepository.softDelete(r.id); refresh(); toast.success("Gelöscht"); }}
                        >Löschen</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </PermissionGate>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl">Verlauf</h3>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>Erstellt {new Date(r.createdAt).toLocaleString("de-CH")}</li>
                <li>Aktualisiert {new Date(r.updatedAt).toLocaleString("de-CH")}</li>
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
