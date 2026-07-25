"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { openingHoursRepository } from "@/repositories/opening-hours-repository";
import type { DailyOpeningHours } from "@/types";

const WD = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export function OpeningHoursEditor({ weekly, canEdit }: { weekly: DailyOpeningHours[]; canEdit: boolean }) {
  const router = useRouter();
  const [pendingDay, setPendingDay] = useState<number | null>(null);

  async function toggleClosed(day: DailyOpeningHours, closed: boolean) {
    setPendingDay(day.weekday);
    await openingHoursRepository.updateDay(day.weekday, { closed, slots: closed ? [] : day.slots.length ? day.slots : [{ open: "11:30", close: "22:00" }] });
    setPendingDay(null);
    router.refresh();
  }

  async function updateSlot(day: DailyOpeningHours, index: number, field: "open" | "close", value: string) {
    const slots = day.slots.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    await openingHoursRepository.updateDay(day.weekday, { slots });
    router.refresh();
  }

  async function addSlot(day: DailyOpeningHours) {
    await openingHoursRepository.updateDay(day.weekday, { slots: [...day.slots, { open: "11:30", close: "14:00" }] });
    router.refresh();
  }

  async function removeSlot(day: DailyOpeningHours, index: number) {
    await openingHoursRepository.updateDay(day.weekday, { slots: day.slots.filter((_, i) => i !== index) });
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-serif text-xl">Woche</h2>
        <div className="mt-4 divide-y divide-border">
          {weekly.map((d) => (
            <div key={d.weekday} className="py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{WD[d.weekday]}</span>
                {canEdit ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Geöffnet</span>
                    <Switch
                      checked={!d.closed}
                      disabled={pendingDay === d.weekday}
                      onCheckedChange={(v) => toggleClosed(d, !v)}
                      aria-label={`${WD[d.weekday]} öffnen/schliessen`}
                    />
                  </div>
                ) : d.closed ? (
                  <Badge variant="outline">geschlossen</Badge>
                ) : (
                  <span className="text-muted-foreground">{d.slots.map((s) => `${s.open} – ${s.close}`).join(" · ")}</span>
                )}
              </div>
              {canEdit && !d.closed && (
                <div className="mt-2 space-y-2">
                  {d.slots.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={s.open}
                        onChange={(e) => updateSlot(d, i, "open", e.target.value)}
                        className="w-32"
                        aria-label={`${WD[d.weekday]} Öffnungszeit ${i + 1} Beginn`}
                      />
                      <span className="text-muted-foreground">–</span>
                      <Input
                        type="time"
                        value={s.close}
                        onChange={(e) => updateSlot(d, i, "close", e.target.value)}
                        className="w-32"
                        aria-label={`${WD[d.weekday]} Öffnungszeit ${i + 1} Ende`}
                      />
                      <Button variant="ghost" size="icon" aria-label="Zeitfenster entfernen" onClick={() => removeSlot(d, i)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addSlot(d)}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Zeitfenster hinzufügen
                  </Button>
                </div>
              )}
              {d.note && <p className="mt-1 text-xs text-muted-foreground">{d.note}</p>}
            </div>
          ))}
        </div>
        {!canEdit && (
          <p className="mt-3 text-xs text-muted-foreground">Nur Manager und Administratoren können Öffnungszeiten bearbeiten.</p>
        )}
      </CardContent>
    </Card>
  );
}
