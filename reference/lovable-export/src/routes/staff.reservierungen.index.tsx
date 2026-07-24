import { createFileRoute, Link } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useQuery } from "@tanstack/react-query";
import { reservationRepository } from "@/repositories";
import { mockSeatingAreas } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, STATUS_LABELS } from "@/components/staff/StatusBadge";
import { useMemo, useState } from "react";
import type { ReservationStatus } from "@/types";
import { Search } from "lucide-react";

export const Route = createFileRoute("/staff/reservierungen/")({
  head: () => ({
    meta: [
      { title: "Reservierungen – Sternen Portal" },
      { name: "description", content: "Alle Reservationen filtern, suchen und verwalten." },
      { property: "og:title", content: "Reservierungen – Sternen Portal" },
      { property: "og:description", content: "Reservationsübersicht mit Filter, Suche und Statusverwaltung." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [area, setArea] = useState<string>("ALL");

  const query = useQuery({
    queryKey: ["res", q, status, area],
    queryFn: () =>
      reservationRepository.findMany({
        search: q || undefined,
        status: status === "ALL" ? undefined : [status],
        seatingAreaId: area === "ALL" ? undefined : area,
      }),
  });

  const rows = useMemo(
    () => (query.data ?? []).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [query.data],
  );

  return (
    <StaffShell title="Reservierungen" description="Alle Reservationen im Überblick">
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Name, E-Mail, Reservationsnummer…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as never)}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Status</SelectItem>
                {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Bereiche</SelectItem>
                {mockSeatingAreas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Zeit</TableHead>
                  <TableHead>Gast</TableHead>
                  <TableHead>Personen</TableHead>
                  <TableHead>Bereich</TableHead>
                  <TableHead>Quelle</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.isLoading && Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={7}><div className="h-8 animate-pulse bg-muted" /></TableCell></TableRow>
                ))}
                {!query.isLoading && rows.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Keine Reservationen gefunden.</TableCell></TableRow>
                )}
                {rows.map((r) => {
                  const area = mockSeatingAreas.find((a) => a.id === r.seatingAreaId);
                  return (
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => (location.href = `/staff/reservierungen/${r.id}`)}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.time}</TableCell>
                      <TableCell>
                        <div className="font-medium">{r.customer.firstName} {r.customer.lastName}</div>
                        <div className="text-xs text-muted-foreground">{r.reservationNumber}</div>
                      </TableCell>
                      <TableCell>{r.partySize}</TableCell>
                      <TableCell>{area?.name ?? <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.source}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {rows.map((r) => (
              <Link key={r.id} to="/staff/reservierungen/$id" params={{ id: r.id }} className="block p-4 hover:bg-muted/40">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.customer.firstName} {r.customer.lastName}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.date} · {r.time} · {r.partySize} Pers.</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </StaffShell>
  );
}
