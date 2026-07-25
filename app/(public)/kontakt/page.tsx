import type { Metadata } from "next";
import { MapPin, Phone, Mail, TramFront } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt & Anfahrt – Sternen Albisrieden",
  description: "So erreichen Sie uns: Adresse, Telefon, E-Mail und Anfahrt mit öffentlichem Verkehr.",
  openGraph: {
    title: "Kontakt & Anfahrt – Sternen Albisrieden",
    description: "Adresse, Telefon und Anfahrt zum Restaurant Sternen Albisrieden.",
    type: "website",
  },
};

export default function KontaktPage() {
  return (
    <section className="container-page py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Kontakt</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Anfahrt & Kontakt</h1>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="space-y-5 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Restaurant Sternen Albisrieden</p>
              <p className="text-muted-foreground">
                Albisriederstrasse 000
                <br />
                8047 Zürich
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-primary" />
            <a href="tel:+41000000000" className="hover:underline">
              +41 00 000 00 00
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <a href="mailto:info@sternenalbisrieden.demo" className="hover:underline">
              info@sternenalbisrieden.demo
            </a>
          </div>
          <div className="flex items-start gap-3">
            <TramFront className="mt-0.5 h-5 w-5 text-primary" />
            <p className="text-muted-foreground">
              Anfahrt mit Tram und Bus – Haltestelle in wenigen Gehminuten (Platzhalter).
            </p>
          </div>
          <a
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            href="https://maps.google.com/?q=Albisrieden+Zurich"
            target="_blank"
            rel="noreferrer"
          >
            Route planen
          </a>
        </div>
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
          Karten-Platzhalter
        </div>
      </div>
    </section>
  );
}
