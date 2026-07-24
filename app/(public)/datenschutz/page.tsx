import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz – Sternen Albisrieden",
  description: "Informationen zum Datenschutz beim Restaurant Sternen Albisrieden.",
  openGraph: {
    title: "Datenschutz – Sternen Albisrieden",
    description: "Datenschutzerklärung des Restaurants Sternen Albisrieden.",
    type: "website",
  },
};

export default function DatenschutzPage() {
  return (
    <section className="container-page max-w-3xl py-20">
      <h1 className="font-serif text-4xl">Datenschutz</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Demo-Text – rechtsverbindliche Fassung vor Veröffentlichung erstellen.
      </p>
      <div className="prose prose-neutral mt-8 space-y-4 text-sm text-muted-foreground">
        <p>
          Wir behandeln Ihre Daten vertraulich und ausschliesslich zur Abwicklung Ihrer Reservation und Anfragen.
          Es findet keine Weitergabe an Dritte für Marketingzwecke statt.
        </p>
        <p>
          Diese Seite ist ein Prototyp. Für eine produktive Version werden wir eine geprüfte
          Datenschutzerklärung nach nDSG bereitstellen.
        </p>
      </div>
    </section>
  );
}
