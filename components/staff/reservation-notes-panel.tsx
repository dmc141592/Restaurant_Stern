"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reservationRepository } from "@/repositories/reservation-repository";
import type { ReservationNote } from "@/types";

// Internal notes are never rendered by any public-facing component — this
// file only ever gets imported from staff pages.
export function ReservationNotesPanel({
  reservationId,
  notes,
  authorId,
  authorName,
}: {
  reservationId: string;
  notes: ReservationNote[];
  authorId: string;
  authorName: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addNote() {
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await reservationRepository.addNote(reservationId, { authorId, authorName, body: note });
      setNote("");
      toast.success("Notiz gespeichert");
      router.refresh();
    } catch {
      toast.error("Notiz konnte nicht gespeichert werden.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {notes.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Notizen.</p>}
      {notes.map((n) => (
        <div key={n.id} className="rounded-md border border-border p-3 text-sm">
          <p className="mb-1 text-xs text-muted-foreground">
            {n.authorName} · {new Date(n.createdAt).toLocaleString("de-CH")}
          </p>
          <p>{n.body}</p>
        </div>
      ))}
      <div className="pt-2">
        <Label>Neue Notiz</Label>
        <Textarea
          placeholder="Notiz hinzufügen…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          aria-label="Neue interne Notiz"
        />
        <Button className="mt-2" disabled={!note.trim() || submitting} onClick={addNote}>
          {submitting ? "Speichert…" : "Notiz speichern"}
        </Button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-xs text-muted-foreground">{children}</p>;
}
