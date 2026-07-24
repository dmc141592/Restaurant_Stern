import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { Badge } from "@/components/ui/badge";
import { mockMenu } from "@/data/mock";

export const Route = createFileRoute("/speisekarte")({
  head: () => ({
    meta: [
      { title: "Speisekarte – Sternen Albisrieden" },
      { name: "description", content: "Unsere aktuelle Karte mit Schweizer Klassikern, saisonalen Kreationen und vegetarischen Gerichten." },
      { property: "og:title", content: "Speisekarte – Sternen Albisrieden" },
      { property: "og:description", content: "Schweizer Klassiker, saisonale Kreationen und vegetarische Gerichte." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PublicShell>
      <section className="container-page py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Kulinarik</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Unsere Speisekarte</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Wir aktualisieren unsere Karte laufend. Hier eine Auswahl – Verfügbarkeit und Preise können sich ändern.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Demo-Inhalt – vor Veröffentlichung prüfen.</p>

        <div className="mt-12 space-y-14">
          {mockMenu.map((cat) => (
            <div key={cat.id}>
              <h2 className="font-serif text-3xl text-primary">{cat.title}</h2>
              {cat.description && <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>}
              <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
                {cat.items.map((it) => (
                  <div key={it.id} className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{it.name}</p>
                        {it.labels?.map((l) => (
                          <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>
                        ))}
                      </div>
                      {it.description && <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {it.priceCHF ? <span className="font-medium text-foreground">CHF {it.priceCHF.toFixed(2)}</span> : "Preis auf Anfrage"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
