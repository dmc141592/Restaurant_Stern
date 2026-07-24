import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – Sternen Albisrieden" },
      { name: "description", content: "Informationen zum Datenschutz beim Restaurant Sternen Albisrieden." },
      { property: "og:title", content: "Datenschutz – Sternen Albisrieden" },
      { property: "og:description", content: "Datenschutzerklärung des Restaurants Sternen Albisrieden." },
    ],
  }),
  component: () => (
    <PublicShell>
      <section className="container-page max-w-3xl py-20">
        <h1 className="font-serif text-4xl">Datenschutz</h1>
        <p className="mt-2 text-xs text-muted-foreground">Demo-Text – rechtsverbindliche Fassung vor Veröffentlichung erstellen.</p>
        <div className="prose prose-neutral mt-8 space-y-4 text-sm text-muted-foreground">
          <p>Wir behandeln Ihre Daten vertraulich und ausschliesslich zur Abwicklung Ihrer Reservation und Anfragen. Es findet keine Weitergabe an Dritte für Marketingzwecke statt.</p>
          <p>Diese Seite ist ein Prototyp. Für eine produktive Version werden wir eine geprüfte Datenschutzerklärung nach nDSG bereitstellen.</p>
        </div>
      </section>
    </PublicShell>
  ),
});
