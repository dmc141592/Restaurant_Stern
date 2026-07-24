import { createFileRoute } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { reservationRepository } from "@/repositories";
import { format, subDays } from "date-fns";
import { Download, Printer } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { STATUS_LABELS } from "@/components/staff/StatusBadge";
import { mockSeatingAreas } from "@/data/mock";
import type { ReservationStatus } from "@/types";

export const Route = createFileRoute("/staff/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics – Sternen Portal" },
      { name: "description", content: "Reservations- und Betriebskennzahlen." },
      { property: "og:title", content: "Analytics – Sternen Portal" },
      { property: "og:description", content: "Analytische Auswertung der Reservationen." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function Page() {
  const [range, setRange] = useState<"week" | "month" | "year">("month");
  const days = range === "week" ? 7 : range === "month" ? 30 : 365;
  const from = format(subDays(new Date(), days), "yyyy-MM-dd");
  const q = useQuery({ queryKey: ["res", "all", from], queryFn: () => reservationRepository.findMany({ from }) });

  const data = q.data ?? [];

  const perDay: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    perDay.push({ date: d.slice(5), count: data.filter((r) => r.date === d).length });
  }

  const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const perWeekday = WEEKDAYS.map((label, i) => ({
    label,
    count: data.filter((r) => new Date(r.date).getDay() === i).length,
  }));

  const perHour = Array.from({ length: 24 }, (_, h) => ({
    label: `${h}h`,
    count: data.filter((r) => parseInt(r.time) === h).length,
  })).filter((h) => h.count > 0);

  const perStatus = (Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => ({
    name: STATUS_LABELS[s].label,
    value: data.filter((r) => r.status === s).length,
  })).filter((s) => s.value > 0);

  const perArea = mockSeatingAreas.map((a) => ({
    label: a.name,
    count: data.filter((r) => r.seatingAreaId === a.id).length,
  }));

  return (
    <StaffShell
      title="Analytics"
      description={`Auswertung der letzten ${days} Tage`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> CSV</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1 h-4 w-4" /> Drucken</Button>
        </div>
      }
    >
      <Tabs value={range} onValueChange={(v) => setRange(v as never)}>
        <TabsList>
          <TabsTrigger value="week">Woche</TabsTrigger>
          <TabsTrigger value="month">Monat</TabsTrigger>
          <TabsTrigger value="year">Jahr</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Reservationen im Verlauf">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={perDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Nach Wochentag">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={perWeekday}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Nach Uhrzeit">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={perHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Nach Status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={perStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {perStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Nach Sitzbereich" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perArea} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" fontSize={11} />
              <YAxis type="category" dataKey="label" fontSize={11} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-chart-4)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </StaffShell>
  );
}

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <h3 className="mb-4 font-serif text-lg">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}
