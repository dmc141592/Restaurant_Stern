"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { openingHoursRepository } from "@/repositories/opening-hours-repository";
import type { SpecialOpeningDate } from "@/types";

export function SpecialDatesEditor({ special, canEdit }: { special: SpecialOpeningDate[]; canEdit: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", closed: true, open_: "17:00", close_: "23:00", publicMessage: "" });

  async function create() {
    if (!form.date) return;
    await openingHoursRepository.createSpecialDate({
      date: form.date,
      closed: form.closed,
      slots: form.closed ? [] : [{ open: form.open_, close: form.close_ }],
      publicMessage: form.publicMessage || undefined,
    });
    toast.success("Spezieller Tag gespeichert");
    setForm({ date: "", closed: true, open_: "17:00", close_: "23:00", publicMessage: "" });
    setOpen(false);
    router.refresh();
  }

  async function remove(id: string) {
    await openingHoursRepository.deleteSpecialDate(id);
    toast.success("Spezieller Tag entfernt");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Spezielle Tage</h2>
          {canEdit && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Hinzufügen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Speziellen Tag hinzufügen</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sd-date">Datum</Label>
                    <Input id="sd-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="sd-closed"
                      checked={form.closed}
                      onCheckedChange={(v) => setForm({ ...form, closed: v })}
                    />
                    <Label htmlFor="sd-closed">Ganztägig geschlossen</Label>
                  </div>
                  {!form.closed && (
                    <div className="flex items-center gap-2">
                      <Input type="time" value={form.open_} onChange={(e) => setForm({ ...form, open_: e.target.value })} />
                      <span className="text-muted-foreground">–</span>
                      <Input type="time" value={form.close_} onChange={(e) => setForm({ ...form, close_: e.target.value })} />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="sd-msg">Öffentliche Mitteilung (optional)</Label>
                    <Input
                      id="sd-msg"
                      value={form.publicMessage}
                      onChange={(e) => setForm({ ...form, publicMessage: e.target.value })}
                      placeholder="z. B. Betriebsferien, Feiertag…"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={create} disabled={!form.date}>
                    Speichern
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="mt-4 space-y-3">
          {special.length === 0 && <p className="text-sm text-muted-foreground">Keine speziellen Tage erfasst.</p>}
          {special.map((s) => (
            <div key={s.id} className="rounded-md border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.date}</span>
                <div className="flex items-center gap-2">
                  {s.closed && <Badge variant="destructive">geschlossen</Badge>}
                  {canEdit && (
                    <Button variant="ghost" size="icon" aria-label={`Speziellen Tag ${s.date} entfernen`} onClick={() => remove(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              {!s.closed && <p className="text-muted-foreground">{s.slots.map((sl) => `${sl.open}–${sl.close}`).join(", ")}</p>}
              {s.publicMessage && <p className="mt-1 text-xs text-muted-foreground">{s.publicMessage}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
