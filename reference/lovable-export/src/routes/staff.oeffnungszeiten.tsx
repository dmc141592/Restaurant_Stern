import { createFileRoute } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery } from "@tanstack/react-query";
import { openingHoursRepository } from "@/repositories";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WD = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export const Route = createFileRoute("/staff/oeffnungszeiten")({
  head: () => ({
    meta: [
      { title: "Öffnungszeiten – Sternen Portal" },
      { name: "description", content: "Reguläre Öffnungszeiten und Spezialtage." },
      { property: "og:title", content: "Öffnungszeiten – Sternen Portal" },
      { property: "og:description", content: "Reguläre und ausserordentliche Öffnungszeiten." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const weekly = useQuery({ queryKey: ["oh", "week"], queryFn: () => openingHoursRepository.getWeeklyHours() });
  const special = useQuery({ queryKey: ["oh", "special"], queryFn: () => openingHoursRepository.getSpecialDates() });

  return (
    <StaffShell title="Öffnungszeiten" description="Reguläre Woche und ausserordentliche Tage">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="font-serif text-xl">Woche</h2>
            <div className="mt-4 divide-y divide-border">
              {weekly.data?.map((d) => (
                <div key={d.weekday} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium">{WD[d.weekday]}</span>
                  <span className="text-muted-foreground">
                    {d.closed ? <Badge variant="outline">geschlossen</Badge> : d.slots.map((s) => `${s.open} – ${s.close}`).join(" · ")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="font-serif text-xl">Spezielle Tage</h2>
            <div className="mt-4 space-y-3">
              {special.data?.map((s) => (
                <div key={s.id} className="rounded-md border border-border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.date}</span>
                    {s.closed && <Badge variant="destructive">geschlossen</Badge>}
                  </div>
                  {!s.closed && <p className="text-muted-foreground">{s.slots.map((sl) => `${sl.open}–${sl.close}`).join(", ")}</p>}
                  {s.publicMessage && <p className="mt-1 text-xs text-muted-foreground">{s.publicMessage}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffShell>
  );
}
