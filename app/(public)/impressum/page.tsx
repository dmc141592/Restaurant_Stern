import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – Sternen Albisrieden",
  description: "Impressum des Restaurants Sternen Albisrieden.",
  openGraph: {
    title: "Impressum – Sternen Albisrieden",
    description: "Rechtliche Angaben zum Betreiber des Restaurants.",
    type: "website",
  },
};

export default function ImpressumPage() {
  return (
    <section className="container-page max-w-3xl py-20">
      <h1 className="font-serif text-4xl">Impressum</h1>
      <p className="mt-2 text-xs text-muted-foreground">Demo-Inhalt – vor Veröffentlichung prüfen.</p>
      <div className="mt-8 space-y-2 text-sm text-muted-foreground">
        <p>Restaurant Sternen Albisrieden</p>
        <p>Albisriederstrasse 000, 8047 Zürich</p>
        <p>Telefon: +41 00 000 00 00</p>
        <p>E-Mail: info@sternenalbisrieden.demo</p>
      </div>
    </section>
  );
}
