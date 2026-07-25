"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import type { AnalyticsResult } from "@/repositories/analytics-service";

const LINE_CONFIG = { count: { label: "Reservationen", color: "var(--color-chart-1)" } } satisfies ChartConfig;
const WEEKDAY_CONFIG = { count: { label: "Reservationen", color: "var(--color-chart-2)" } } satisfies ChartConfig;
const HOUR_CONFIG = { count: { label: "Reservationen", color: "var(--color-chart-3)" } } satisfies ChartConfig;
const AREA_CONFIG = { count: { label: "Reservationen", color: "var(--color-chart-4)" } } satisfies ChartConfig;

const STATUS_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function AnalyticsCharts({ data }: { data: AnalyticsResult }) {
  const statusConfig = Object.fromEntries(
    data.perStatus.map((s, i) => [s.name, { label: s.name, color: STATUS_COLORS[i % STATUS_COLORS.length] }]),
  ) satisfies ChartConfig;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Reservationen im Verlauf">
        {data.perDay.every((d) => d.count === 0) ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={LINE_CONFIG} className="h-[260px] w-full">
            <LineChart data={data.perDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
      </ChartCard>

      <ChartCard title="Nach Wochentag">
        {data.perWeekday.every((d) => d.count === 0) ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={WEEKDAY_CONFIG} className="h-[260px] w-full">
            <BarChart data={data.perWeekday}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </ChartCard>

      <ChartCard title="Nach Uhrzeit">
        {data.perHour.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={HOUR_CONFIG} className="h-[260px] w-full">
            <BarChart data={data.perHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </ChartCard>

      <ChartCard title="Nach Status">
        {data.perStatus.length === 0 ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={statusConfig} className="h-[260px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={data.perStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {data.perStatus.map((s, i) => (
                  <Cell key={s.name} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </ChartCard>

      <ChartCard title="Nach Sitzbereich" className="lg:col-span-2">
        {data.perSeatingArea.every((d) => d.count === 0) ? (
          <EmptyChart />
        ) : (
          <ChartContainer config={AREA_CONFIG} className="h-[220px] w-full">
            <BarChart data={data.perSeatingArea} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="label" fontSize={11} width={110} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </ChartCard>
    </div>
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

function EmptyChart() {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
      Keine Daten für diesen Zeitraum.
    </div>
  );
}
