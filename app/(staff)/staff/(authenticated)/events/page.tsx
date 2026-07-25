import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StaffShell } from "@/components/staff/staff-shell";
import { EventSearch } from "@/components/staff/event-search";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { requireDemoSession } from "@/lib/demo-session";
import { can } from "@/lib/permissions";
import { eventRepository } from "@/repositories/event-repository";
import { notificationRepository } from "@/repositories/notification-repository";
import type { RestaurantEvent } from "@/types";

export const metadata: Metadata = {
  title: "Events – Sternen Portal",
  description: "Events erstellen, bearbeiten und veröffentlichen.",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = await requireDemoSession();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.toLowerCase() : "";

  const [allEvents, notifications] = await Promise.all([eventRepository.findMany(), notificationRepository.findAll()]);
  const events = q ? allEvents.filter((e) => e.title.toLowerCase().includes(q)) : allEvents;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.startDate >= today && e.status === "PUBLISHED");
  const drafts = events.filter((e) => e.status === "DRAFT");
  const past = events.filter((e) => e.startDate < today);
  const archived = events.filter((e) => e.status === "ARCHIVED");

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Events"
      description="Anlässe verwalten und veröffentlichen"
      actions={
        can(user.role, "event.create") ? (
          <Button asChild size="sm">
            <Link href="/staff/events/new">
              <Plus className="mr-1 h-4 w-4" />
              Neues Event
            </Link>
          </Button>
        ) : undefined
      }
    >
      <div className="mb-4">
        <EventSearch />
      </div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Kommend ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="drafts">Entwürfe ({drafts.length})</TabsTrigger>
          <TabsTrigger value="past">Vergangen ({past.length})</TabsTrigger>
          <TabsTrigger value="archived">Archiviert ({archived.length})</TabsTrigger>
          <TabsTrigger value="all">Alle ({events.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Grid events={upcoming} />
        </TabsContent>
        <TabsContent value="drafts">
          <Grid events={drafts} />
        </TabsContent>
        <TabsContent value="past">
          <Grid events={past} />
        </TabsContent>
        <TabsContent value="archived">
          <Grid events={archived} />
        </TabsContent>
        <TabsContent value="all">
          <Grid events={events} />
        </TabsContent>
      </Tabs>
    </StaffShell>
  );
}

function Grid({ events }: { events: RestaurantEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        Keine Events vorhanden.
      </div>
    );
  }
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <Link key={e.id} href={`/staff/events/${e.id}`}>
          <Card className="h-full hover:border-primary/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Badge variant={e.status === "PUBLISHED" ? "default" : "secondary"}>{e.status}</Badge>
                <Badge variant="outline">{e.visibility === "PUBLIC" ? "Öffentlich" : "Nur Team"}</Badge>
              </div>
              <h3 className="mt-3 font-serif text-lg">{e.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {e.startDate} · {e.startTime}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.shortDescription}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
