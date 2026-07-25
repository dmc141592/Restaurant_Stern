"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";

export function SeatingAreaCreateDialog({
  nextDisplayOrder,
  currentUserId,
}: {
  nextDisplayOrder: number;
  currentUserId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", capacity: 20, minPartySize: 1, maxPartySize: 12 });

  async function create() {
    if (!form.name.trim()) return;
    await seatingAreaRepository.create({
      ...form,
      publiclyBookable: false,
      currentlyOpen: true,
      displayOrder: nextDisplayOrder,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedBy: currentUserId,
      updatedAt: new Date().toISOString(),
    });
    toast.success("Sitzbereich erstellt");
    setForm({ name: "", description: "", capacity: 20, minPartySize: 1, maxPartySize: 12 });
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> Sitzbereich hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuer Sitzbereich</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="new-area-name">Name</Label>
            <Input id="new-area-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="new-area-desc">Beschreibung</Label>
            <Input
              id="new-area-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="new-area-cap">Kapazität</Label>
              <Input
                id="new-area-cap"
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="new-area-min">Min.</Label>
              <Input
                id="new-area-min"
                type="number"
                value={form.minPartySize}
                onChange={(e) => setForm({ ...form, minPartySize: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="new-area-max">Max.</Label>
              <Input
                id="new-area-max"
                type="number"
                value={form.maxPartySize}
                onChange={(e) => setForm({ ...form, maxPartySize: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={create} disabled={!form.name.trim()}>
            Erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
