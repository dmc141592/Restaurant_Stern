import type { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { eventRepository } from "@/repositories/event-repository";
import type { RestaurantEvent } from "@/types";

export const metadata: Metadata = {
  title: "Events – Sternen Albisrieden",
  description:
    "Kommende Anlässe und Feiern im Sternen Albisrieden. Für Familienfeste, Bankette und private Anlässe beraten wir Sie persönlich.",
  openGraph: {
    title: "Events – Sternen Albisrieden",
    description: "Kommende Anlässe und private Feiern im Sternen Albisrieden.",
    type: "website",
  },
};

export default async function EventsPage() {
  const events = await eventRepository.findPublic();
  const todayIso = new Date().toISOString().slice(0, 10);

  const upcoming = events
    .filter((e) => e.startDate >= todayIso)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = events
    .filter((e) => e.startDate < todayIso)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <section className="container-page py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Anlässe</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Kommende Events</h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {upcoming.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aktuell sind keine öffentlichen Events geplant.
          </div>
        )}
        {upcoming.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      <div className="mt-16 rounded-lg border border-border bg-muted/40 p-8">
        <h2 className="font-serif text-2xl text-primary">Private Feiern & Bankette</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Geburtstage, Hochzeitsapéros, Firmenanlässe – wir haben Räume für Gruppen ab 8 bis 60 Personen und
          beraten Sie gerne persönlich.
        </p>
      </div>

      {past.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl text-muted-foreground">Vergangene Events</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {past.map((e) => (
              <EventCard key={e.id} event={e} muted />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function EventCard({ event, muted = false }: { event: RestaurantEvent; muted?: boolean }) {
  return (
    <Card className={muted ? "overflow-hidden border-border opacity-70" : "overflow-hidden border-border"}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
          <CalendarDays className="h-3.5 w-3.5" />
          {format(parseISO(event.startDate), "EEEE, d. MMMM yyyy", { locale: de })} · {event.startTime}
        </div>
        <h2 className="mt-2 font-serif text-2xl">{event.title}</h2>
        <p className="mt-2 text-muted-foreground">{event.shortDescription}</p>
        <p className="mt-4 text-sm">{event.fullDescription}</p>
        {event.reservationRequired && !muted && (
          <p className="mt-4 text-xs font-medium text-primary">Reservation empfohlen</p>
        )}
      </CardContent>
    </Card>
  );
}
