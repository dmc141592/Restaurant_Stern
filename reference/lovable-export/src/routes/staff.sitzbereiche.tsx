import { createFileRoute } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { seatingAreaRepository } from "@/repositories";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PermissionGate } from "@/components/staff/PermissionGate";

export const Route = createFileRoute("/staff/sitzbereiche")({
  head: () => ({
    meta: [
      { title: "Sitzbereiche – Sternen Portal" },
      { name: "description", content: "Sitzbereiche und Kapazitäten verwalten." },
      { property: "og:title", content: "Sitzbereiche – Sternen Portal" },
      { property: "og:description", content: "Sitzbereiche des Restaurants." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["areas"], queryFn: () => seatingAreaRepository.findMany() });
  return (
    <StaffShell title="Sitzbereiche" description="Räume, Kapazitäten und Verfügbarkeit">
      <div className="grid gap-4 md:grid-cols-2">
        {q.data?.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl">{a.name}</h3>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </div>
                <PermissionGate perm="seating.manage" fallback={<Badge variant={a.currentlyOpen ? "default" : "secondary"}>{a.currentlyOpen ? "Offen" : "Zu"}</Badge>}>
                  <Switch
                    checked={a.currentlyOpen}
                    onCheckedChange={async (v) => { await seatingAreaRepository.update(a.id, { currentlyOpen: v }); qc.invalidateQueries({ queryKey: ["areas"] }); }}
                  />
                </PermissionGate>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Stat label="Kapazität" value={a.capacity} />
                <Stat label="Min. Gruppe" value={a.minPartySize} />
                <Stat label="Max. Gruppe" value={a.maxPartySize} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Badge variant={a.publiclyBookable ? "default" : "outline"}>
                  {a.publiclyBookable ? "Online buchbar" : "Nur auf Anfrage"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </StaffShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/40 p-2 text-center">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-serif text-lg">{value}</p>
    </div>
  );
}
