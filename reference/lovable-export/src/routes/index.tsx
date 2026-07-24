import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Clock, Utensils, Trees, Phone } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { eventRepository } from "@/repositories";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import heroImg from "@/assets/hero-restaurant.jpg";
import gardenImg from "@/assets/garden.jpg";
import dishImg from "@/assets/dish.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Restaurant Sternen Albisrieden – Herzliche Gastfreundschaft in Zürich" },
      {
        name: "description",
        content:
          "Traditionelle Schweizer Küche, gemütliches Restaurant und lauschiger Garten mitten in Albisrieden. Reservieren Sie jetzt Ihren Tisch.",
      },
      { property: "og:title", content: "Restaurant Sternen Albisrieden" },
      {
        property: "og:description",
        content: "Traditionelle Schweizer Küche und ein lauschiger Garten mitten in Albisrieden.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const events = useQuery({ queryKey: ["events", "public"], queryFn: () => eventRepository.findPublic() });

  return (
    <PublicShell>
      {/* HERO */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Sternen Albisrieden Innenraum" className="h-full w-full object-cover" width={1600} height={1000} />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/50 to-background" />
        </div>
        <div className="container-page flex min-h-[78vh] flex-col justify-end pb-16 pt-32 text-primary-foreground md:min-h-[85vh]">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-primary-foreground/80">
            Seit Generationen · Albisrieden Zürich
          </p>
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.05] text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Ein warmes <em className="font-normal not-italic text-accent">Willkommen</em> im Quartier.
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85">
            Traditionelle Schweizer Küche, saisonale Kreationen und ein lauschiger Garten – wir freuen uns auf Ihren Besuch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/reservation">Tisch reservieren <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/speisekarte">Speisekarte entdecken</Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-3 rounded-xl border border-primary-foreground/15 bg-charcoal/40 p-4 backdrop-blur-sm sm:grid-cols-3">
            <QuickInfo icon={MapPin} label="Albisriederstrasse, 8047 Zürich" />
            <QuickInfo icon={Clock} label="Heute geöffnet · 11:30 – 23:00" />
            <QuickInfo icon={Phone} label="+41 00 000 00 00" />
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="container-page grid gap-12 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Unser Haus</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">
            Ein Ort, an dem sich das Quartier trifft.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Der Sternen ist tief mit Albisrieden verwurzelt. Bei uns treffen sich Nachbarn, Familien und Gäste aus der ganzen Stadt zu einem herzlichen Znacht, einem Business-Lunch oder einer Feier im Sääli.
            </p>
            <p>
              Unsere Küche verbindet klassische Zürcher Gerichte mit saisonalen Zutaten aus der Region – ehrlich, sorgfältig und ohne Schnickschnack.
            </p>
          </div>
          <Button asChild variant="link" className="mt-4 px-0 text-primary">
            <Link to="/restaurant">Mehr über uns <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="relative">
          <img src={dishImg} alt="Saisonales Gericht" className="rounded-lg object-cover shadow-xl" width={1200} height={900} loading="lazy" />
          <div className="absolute -bottom-6 -left-6 hidden rounded-lg border border-border bg-card p-5 shadow-lg sm:block">
            <p className="font-serif text-2xl text-primary">Saison</p>
            <p className="text-xs text-muted-foreground">Wechselnde Karte je nach Angebot</p>
          </div>
        </div>
      </section>

      {/* GARDEN */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page grid gap-10 py-24 md:grid-cols-5 md:items-center">
          <div className="md:col-span-3 md:order-2">
            <img src={gardenImg} alt="Gartenrestaurant" className="rounded-lg object-cover shadow-xl" width={1400} height={900} loading="lazy" />
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-accent">Gartenrestaurant</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ein Sommer unter Bäumen.</h2>
            <p className="mt-4 text-primary-foreground/80">
              Sobald es die Temperaturen zulassen, öffnen wir unseren Garten – geschützt, grün und ideal für laue Abende mit Freunden.
            </p>
            <Button asChild variant="outline" className="mt-6 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/reservation">Tisch im Garten anfragen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MENU PREVIEW */}
      <section className="container-page py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Speisekarte</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Kleine Auswahl</h2>
          </div>
          <Button asChild variant="link" className="text-primary">
            <Link to="/speisekarte">Ganze Karte ansehen <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Utensils, title: "Zürcher Klassiker", body: "Geschnetzeltes mit hausgemachter Rösti, Cordon Bleu und mehr." },
            { icon: Trees, title: "Saisonal & Regional", body: "Wechselnde Kreationen mit Zutaten aus der Region." },
            { icon: Utensils, title: "Vegetarisch", body: "Immer mit dabei: warme, sättigende vegetarische Gerichte." },
          ].map((c, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-6">
                <c.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-serif text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-muted/50">
        <div className="container-page py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">Anlässe</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Kommende Events</h2>
            </div>
            <Button asChild variant="link" className="text-primary">
              <Link to="/events">Alle Events <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {(events.data ?? []).slice(0, 2).map((e) => (
              <Card key={e.id} className="overflow-hidden border-border">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-widest text-accent">
                    {format(parseISO(e.startDate), "EEEE, d. MMMM yyyy", { locale: de })}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.shortDescription}</p>
                  <p className="mt-4 text-xs text-muted-foreground">Beginn {e.startTime} Uhr</p>
                </CardContent>
              </Card>
            ))}
            {events.isLoading && (
              <div className="h-40 animate-pulse rounded-lg bg-muted" />
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="container-page py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Kontakt</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Wir freuen uns auf Sie</h2>
            <p className="mt-4 text-muted-foreground">
              Rufen Sie uns an oder reservieren Sie bequem online. Für Anlässe und Bankette beraten wir Sie gerne persönlich.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Albisriederstrasse 000, 8047 Zürich</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <a className="hover:underline" href="tel:+41000000000">+41 00 000 00 00</a></p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Demo-Angaben – vor Veröffentlichung prüfen.</p>
          </div>
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-12 text-center text-sm text-muted-foreground">
            Karte-Platzhalter · wird später mit Kartenanbieter ersetzt
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function QuickInfo({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-primary-foreground/90">
      <Icon className="h-4 w-4 text-accent" />
      <span>{label}</span>
    </div>
  );
}
