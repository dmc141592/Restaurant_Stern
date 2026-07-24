import { createFileRoute } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "@/repositories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PermissionGate } from "@/components/staff/PermissionGate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { roleLabel } from "@/lib/permissions";
import type { UserRole } from "@/types";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/staff/team")({
  head: () => ({
    meta: [
      { title: "Team – Sternen Portal" },
      { name: "description", content: "Mitarbeitende und Rollen verwalten." },
      { property: "og:title", content: "Team – Sternen Portal" },
      { property: "og:description", content: "Team- und Rollenverwaltung." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["users"], queryFn: () => userRepository.findMany() });
  const [open, setOpen] = useState(false);
  const [inv, setInv] = useState({ firstName: "", lastName: "", email: "", role: "EMPLOYEE" as UserRole });

  return (
    <StaffShell
      title="Team"
      description="Mitarbeitende, Einladungen und Rollen"
      actions={
        <PermissionGate perm="user.invite.employee">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><UserPlus className="mr-1 h-4 w-4" />Einladen</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Mitarbeitende einladen</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div><Label>Vorname</Label><Input value={inv.firstName} onChange={(e) => setInv({ ...inv, firstName: e.target.value })} /></div>
                <div><Label>Nachname</Label><Input value={inv.lastName} onChange={(e) => setInv({ ...inv, lastName: e.target.value })} /></div>
                <div><Label>E-Mail</Label><Input type="email" value={inv.email} onChange={(e) => setInv({ ...inv, email: e.target.value })} /></div>
                <div>
                  <Label>Rolle</Label>
                  <Select value={inv.role} onValueChange={(v) => setInv({ ...inv, role: v as UserRole })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Mitarbeiter</SelectItem>
                      <PermissionGate perm="user.invite.manager"><SelectItem value="MANAGER">Manager</SelectItem></PermissionGate>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                  Ablauf: Einladung wird erstellt → Mitarbeiter erhält E-Mail → öffnet Link → setzt Passwort → Konto aktiv.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
                <Button onClick={async () => { await userRepository.invite(inv); qc.invalidateQueries({ queryKey: ["users"] }); toast.success("Einladung gesendet (Demo)"); setOpen(false); }}>Einladen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      }
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Letzte Anmeldung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.data?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{roleLabel(u.role)}</TableCell>
                  <TableCell>
                    {u.status === "ACTIVE" && <Badge>Aktiv</Badge>}
                    {u.status === "INVITED" && <Badge variant="secondary">Eingeladen</Badge>}
                    {u.status === "DEACTIVATED" && <Badge variant="outline">Deaktiviert</Badge>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.lastLoginAt?.slice(0, 10) ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </StaffShell>
  );
}
