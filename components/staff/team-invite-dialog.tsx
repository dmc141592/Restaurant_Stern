"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleLabel } from "@/lib/permissions";
import { userRepository } from "@/repositories/user-repository";
import type { UserRole } from "@/types";

// FUTURE REPLACEMENT POINT: real invitations become a Server Action that
// creates a PENDING invitation, emails a secure single-use link, and only
// activates the account once the recipient sets a password (see the 5-step
// flow described below) — nothing here sends a real email.
export function TeamInviteDialog({ invitableRoles }: { invitableRoles: UserRole[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: invitableRoles[0] });

  async function invite() {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) return;
    await userRepository.invite(form);
    toast.success("Einladung erstellt (Demo)");
    setForm({ firstName: "", lastName: "", email: "", role: invitableRoles[0] });
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-1 h-4 w-4" /> Einladen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mitarbeitende einladen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label htmlFor="inv-firstName">Vorname</Label>
            <Input id="inv-firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="inv-lastName">Nachname</Label>
            <Input id="inv-lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="inv-email">E-Mail</Label>
            <Input id="inv-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="inv-role">Rolle</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
              <SelectTrigger id="inv-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {invitableRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleLabel(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            Ablauf: Einladung wird erstellt → Mitarbeiter erhält E-Mail → öffnet sicheren Einladungslink → setzt
            Passwort → Konto wird aktiv. Kein Passwort wird von Ihnen festgelegt.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={invite} disabled={!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()}>
            Einladen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
