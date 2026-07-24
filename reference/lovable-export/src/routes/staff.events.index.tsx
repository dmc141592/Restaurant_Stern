import { createFileRoute, Link } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery } from "@tanstack/react-query";
import { eventRepository } from "@/repositories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { RestaurantEvent } from "@/types";

export const Route = createFileRoute("/staff/events/")({
  head: () => ({
    meta: [
      { title: "Events – Sternen Portal" },
      { name: "description", content: "Events erstellen, bearbeiten und veröffentlichen." },
      { property: "og:title", content: "Events – Sternen Portal" },
      { property: "og:description", content: "Event-Verwaltung für das Restaurant Sternen Albisrieden." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const q = useQuery({ queryKey: ["events"], queryFn: () => eventRepository.findMany() });
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = q.data?.filter((e) => e.startDate >= today && e.status !== "DRAFT") ?? [];
  const past = q.data?.filter((e) => e.startDate < today) ?? [];
  const drafts = q.data?.filter((e) => e.status === "DRAFT") ?? [];

  return (
    <StaffShell
      title="Events"
      description="Anlässe verwalten und veröffentlichen"
      actions={
        <Button asChild size="sm"><Link to="/staff/events/new"><Plus className="mr-1 h-4 w-4" />Neues Event</Link></Button>
      }
    >
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Kommend ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="drafts">Entwürfe ({drafts.length})</TabsTrigger>
          <TabsTrigger value="past">Vergangen ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming"><Grid events={upcoming} /></TabsContent>
        <TabsContent value="drafts"><Grid events={drafts} /></TabsContent>
        <TabsContent value="past"><Grid events={past} /></TabsContent>
      </Tabs>
    </StaffShell>
  );
}

function Grid({ events }: { events: RestaurantEvent[] }) {
  if (events.length === 0) return <div className="mt-8 rounded-lg border border-dashed p-10 text-center text-muted-foreground">Keine Events vorhanden.</div>;
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <Link key={e.id} to="/staff/events/$id" params={{ id: e.id }}>
          <Card className="h-full hover:border-primary/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Badge variant={e.status === "PUBLISHED" ? "default" : "secondary"}>{e.status}</Badge>
                <Badge variant="outline">{e.visibility === "PUBLIC" ? "Öffentlich" : "Nur Team"}</Badge>
              </div>
              <h3 className="mt-3 font-serif text-lg">{e.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{e.startDate} · {e.startTime}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.shortDescription}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
