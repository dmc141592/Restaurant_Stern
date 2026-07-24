import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import gardenImg from "@/assets/garden.jpg";
import heroImg from "@/assets/hero-restaurant.jpg";

export const Route = createFileRoute("/restaurant")({
  head: () => ({
    meta: [
      { title: "Das Restaurant – Sternen Albisrieden" },
      { name: "description", content: "Traditionelles Restaurant im Herzen von Albisrieden – unsere Geschichte, unser Team, unsere Küche." },
      { property: "og:title", content: "Das Restaurant – Sternen Albisrieden" },
      { property: "og:description", content: "Unsere Geschichte, unsere Küche und das Team hinter dem Sternen Albisrieden." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PublicShell>
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/60" />
        </div>
        <div className="container-page flex min-h-[45vh] flex-col justify-end pb-14 pt-24 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Über uns</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl sm:text-5xl md:text-6xl">Das Restaurant</h1>
        </div>
      </section>

      <section className="container-page grid gap-12 py-20 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6 text-base leading-relaxed text-foreground">
          <h2 className="font-serif text-3xl text-primary">Verwurzelt im Quartier</h2>
          <p>
            Seit vielen Jahren ist der Sternen ein fester Treffpunkt in Albisrieden. Bei uns essen Sie, wo schon Ihre Nachbarn und deren Grosseltern eingekehrt sind – in gemütlichen Räumen mit warmem Holz, weissen Tischtüchern und einem Team, das Sie mit Namen begrüsst.
          </p>
          <p>
            Wir kochen traditionelle Schweizer Klassiker und ergänzen sie mit saisonalen Kreationen. Wo immer möglich beziehen wir unsere Zutaten aus der Region, damit auf dem Teller landet, was wirklich Sinn macht.
          </p>
          <h2 className="font-serif text-3xl text-primary">Gastfreundschaft mit Substanz</h2>
          <p>
            Ein Restaurant ist mehr als ein Ort, an dem gegessen wird. Es ist Bühne für Geburtstage, Geschäftsessen, Sonntagslunches und stille Feierabende. Wir geben unser Bestes, damit sich jeder Anlass wie zuhause anfühlt.
          </p>
        </div>
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent">Kurz gesagt</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Traditionelle Schweizer Küche</li>
              <li>· Saisonale Karte</li>
              <li>· Restaurant, Garten, Sääli, Stübli</li>
              <li>· Für Feiern und Bankette</li>
            </ul>
          </div>
          <img src={gardenImg} alt="Gartenrestaurant" className="rounded-lg object-cover" loading="lazy" />
          <p className="text-xs text-muted-foreground">Demo-Inhalt – vor Veröffentlichung prüfen.</p>
        </aside>
      </section>
    </PublicShell>
  );
}
