"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import type { AnalyticsPeriod } from "@/repositories/analytics-service";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "day", label: "Tag" },
  { value: "week", label: "Woche" },
  { value: "month", label: "Monat" },
  { value: "season", label: "Saison" },
  { value: "year", label: "Jahr" },
  { value: "custom", label: "Zeitraum" },
];

export function AnalyticsPeriodSelect({ period, from, to }: { period: AnalyticsPeriod; from: string; to: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setPeriod(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", next);
    router.push(`/staff/analytics?${params.toString()}`);
  }

  function setCustomDate(key: "from" | "to", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", "custom");
    params.set(key, value);
    router.push(`/staff/analytics?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          {PERIODS.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {period === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={from}
            onChange={(e) => setCustomDate("from", e.target.value)}
            aria-label="Von Datum"
            className="w-40"
          />
          <span className="text-sm text-muted-foreground">bis</span>
          <Input
            type="date"
            value={to}
            onChange={(e) => setCustomDate("to", e.target.value)}
            aria-label="Bis Datum"
            className="w-40"
          />
        </div>
      )}
    </div>
  );
}
