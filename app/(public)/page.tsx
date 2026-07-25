import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Utensils, Trees } from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSection } from "@/components/public/hero-section";
import { InfoStrip } from "@/components/public/info-strip";
import { eventRepository } from "@/repositories/event-repository";
import { openingHoursRepository } from "@/repositories/opening-hours-repository";
import heroImg from "@/assets/hero-restaurant.jpg";
import gardenImg from "@/assets/garden.jpg";
import dishImg from "@/assets/dish.jpg";

export const metadata: Metadata = {
  title: "Restaurant Sternen Albisrieden – Herzliche Gastfreundschaft in Zürich",
  description:
    "Traditionelle Schweizer Küche, gemütliches Restaurant und lauschiger Garten mitten in Albisrieden. Reservieren Sie jetzt Ihren Tisch.",
  openGraph: {
    title: "Restaurant Sternen Albisrieden",
    description: "Traditionelle Schweizer Küche und ein lauschiger Garten mitten in Albisrieden.",
    type: "website",
  },
};

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export default async function HomePage() {
  const [events, openingHours] = await Promise.all([
    eventRepository.findPublic(),
    openingHoursRepository.getWeeklyHours(),
  ]);
  const upcomingEvents = events.slice(0, 2);

  return (
    <>
      {/* HERO */}
      <HeroSection image={heroImg} />

      {/* INFO STRIP */}
      <InfoStrip />

      {/* STORY */}
      <section className="container-page grid gap-12 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Unser Haus</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">
            Ein Ort, an dem sich das Quartier trifft.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Der Sternen ist tief mit Albisrieden verwurzelt. Bei uns treffen sich Nachbarn, Familien und Gäste
              aus der ganzen Stadt zu einem herzlichen Znacht, einem Business-Lunch oder einer Feier im Sääli.
            </p>
            <p>
              Unsere Küche verbindet klassische Zürcher Gerichte mit saisonalen Zutaten aus der Region – ehrlich,
              sorgfältig und ohne Schnickschnack.
            </p>
          </div>
          <Button asChild variant="link" className="mt-4 px-0 text-primary">
            <Link href="/restaurant">
              Mehr über uns <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <Image src={dishImg} alt="Saisonales Gericht" className="rounded-lg object-cover shadow-xl" />
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
            <Image src={gardenImg} alt="Gartenrestaurant" className="rounded-lg object-cover shadow-xl" />
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-accent">Gartenrestaurant</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ein Sommer unter Bäumen.</h2>
            <p className="mt-4 text-primary-foreground/80">
              Sobald es die Temperaturen zulassen, öffnen wir unseren Garten – geschützt, grün und ideal für laue
              Abende mit Freunden.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-6 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/reservation">Tisch im Garten anfragen</Link>
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
            <Link href="/speisekarte">
              Ganze Karte ansehen <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Utensils,
              title: "Zürcher Klassiker",
              body: "Geschnetzeltes mit hausgemachter Rösti, Cordon Bleu und mehr.",
            },
            {
              icon: Trees,
              title: "Saisonal & Regional",
              body: "Wechselnde Kreationen mit Zutaten aus der Region.",
            },
            {
              icon: Utensils,
              title: "Vegetarisch",
              body: "Immer mit dabei: warme, sättigende vegetarische Gerichte.",
            },
          ].map((c) => (
            <Card key={c.title} className="border-border">
              <CardContent className="p-6">
                <c.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-serif text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* OPENING HOURS PREVIEW */}
      <section className="bg-muted/50">
        <div className="container-page py-24">
          <p className="text-xs uppercase tracking-widest text-accent">Öffnungszeiten</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Wann Sie uns finden</h2>
          <div className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
            {openingHours.map((day) => (
              <div
                key={day.weekday}
                className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-2.5 text-sm"
              >
                <span className="font-medium">{WEEKDAY_LABELS[day.weekday]}</span>
                <span className="text-muted-foreground">
                  {day.closed ? (day.note ?? "Ruhetag") : day.slots.map((s) => `${s.open} – ${s.close}`).join(" · ")}
                </span>
              </div>
            ))}
          </div>
          <Button asChild variant="link" className="mt-4 px-0 text-primary">
            <Link href="/kontakt">
              Anfahrt &amp; Kontakt <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* EVENTS */}
      <section className="container-page py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Anlässe</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Kommende Events</h2>
          </div>
          <Button asChild variant="link" className="text-primary">
            <Link href="/events">
              Alle Events <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((e) => (
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
        </div>
      </section>

      {/* CONTACT */}
      <section className="container-page py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Kontakt</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Wir freuen uns auf Sie</h2>
            <p className="mt-4 text-muted-foreground">
              Rufen Sie uns an oder reservieren Sie bequem online. Für Anlässe und Bankette beraten wir Sie gerne
              persönlich.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Albisriederstrasse 000, 8047 Zürich
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />{" "}
                <a className="hover:underline" href="tel:+41000000000">
                  +41 00 000 00 00
                </a>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-12 text-center text-sm text-muted-foreground">
            Karte-Platzhalter · wird später mit Kartenanbieter ersetzt
          </div>
        </div>
      </section>
    </>
  );
}
