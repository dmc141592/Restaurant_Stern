import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { useQuery } from "@tanstack/react-query";
import { eventRepository } from "@/repositories";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events – Sternen Albisrieden" },
      { name: "description", content: "Kommende Anlässe und Feiern im Sternen Albisrieden. Für Familienfeste, Bankette und private Anlässe beraten wir Sie persönlich." },
      { property: "og:title", content: "Events – Sternen Albisrieden" },
      { property: "og:description", content: "Kommende Anlässe und private Feiern im Sternen Albisrieden." },
    ],
  }),
  component: Page,
});

function Page() {
  const q = useQuery({ queryKey: ["events", "public"], queryFn: () => eventRepository.findPublic() });

  return (
    <PublicShell>
      <section className="container-page py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Anlässe</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Kommende Events</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {q.isLoading && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-lg bg-muted" />
          ))}
          {q.data?.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Aktuell sind keine öffentlichen Events geplant.
            </div>
          )}
          {q.data?.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {format(parseISO(e.startDate), "EEEE, d. MMMM yyyy", { locale: de })} · {e.startTime}
                </div>
                <h2 className="mt-2 font-serif text-2xl">{e.title}</h2>
                <p className="mt-2 text-muted-foreground">{e.shortDescription}</p>
                <p className="mt-4 text-sm">{e.fullDescription}</p>
                {e.reservationRequired && (
                  <p className="mt-4 text-xs font-medium text-primary">Reservation empfohlen</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-border bg-muted/40 p-8">
          <h2 className="font-serif text-2xl text-primary">Private Feiern & Bankette</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Geburtstage, Hochzeitsapéros, Firmenanlässe – wir haben Räume für Gruppen ab 8 bis 60 Personen und beraten Sie gerne persönlich.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
