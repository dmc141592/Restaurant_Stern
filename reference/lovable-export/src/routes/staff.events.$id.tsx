import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eventRepository } from "@/repositories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGate } from "@/components/staff/PermissionGate";
import { ArrowLeft, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/events/$id")({
  head: () => ({
    meta: [
      { title: "Event – Sternen Portal" },
      { name: "description", content: "Event bearbeiten und verwalten." },
      { property: "og:title", content: "Event – Sternen Portal" },
      { property: "og:description", content: "Event-Detailansicht." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = useParams({ from: "/staff/events/$id" });
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["event", id], queryFn: () => eventRepository.findById(id) });
  const refresh = () => qc.invalidateQueries({ queryKey: ["event"] });
  if (q.isLoading || !q.data) return <StaffShell title="Lade…"><div className="h-40 animate-pulse rounded-lg bg-muted" /></StaffShell>;
  const e = q.data;

  return (
    <StaffShell title={e.title}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to="/staff/events"><ArrowLeft className="mr-1 h-4 w-4" /> Zurück</Link>
      </Button>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Badge>{e.status}</Badge>
              <Badge variant="outline">{e.visibility === "PUBLIC" ? "Öffentlich" : "Nur Team"}</Badge>
            </div>
            <h2 className="mt-3 font-serif text-2xl">{e.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{e.startDate} {e.startTime} – {e.endDate} {e.endTime}</p>
            <p className="mt-4 text-sm">{e.fullDescription}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-serif text-lg">Aktionen</h3>
            <Button className="w-full" variant="outline" onClick={async () => { await eventRepository.publish(e.id); refresh(); toast.success("Veröffentlicht"); }}>
              <Eye className="mr-2 h-4 w-4" /> Veröffentlichen
            </Button>
            <Button className="w-full" variant="outline" onClick={async () => { await eventRepository.hide(e.id); refresh(); toast.success("Ausgeblendet"); }}>
              <EyeOff className="mr-2 h-4 w-4" /> Nicht mehr öffentlich
            </Button>
            <PermissionGate perm="event.softDelete">
              <Button className="w-full" variant="destructive" onClick={async () => { await eventRepository.softDelete(e.id); refresh(); toast.success("Gelöscht"); }}>
                <Trash2 className="mr-2 h-4 w-4" /> Event löschen
              </Button>
            </PermissionGate>
          </CardContent>
        </Card>
      </div>
    </StaffShell>
  );
}
