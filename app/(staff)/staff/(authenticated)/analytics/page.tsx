import type { Metadata } from "next";
import { StaffShell } from "@/components/staff/staff-shell";
import { AnalyticsPeriodSelect } from "@/components/staff/analytics-period-select";
import { AnalyticsExportActions } from "@/components/staff/analytics-export-actions";
import { AnalyticsCharts } from "@/components/staff/analytics-charts";
import { Card, CardContent } from "@/components/ui/card";
import { requireDemoSession } from "@/lib/demo-session";
import { getAnalytics, type AnalyticsPeriod } from "@/repositories/analytics-service";
import { notificationRepository } from "@/repositories/notification-repository";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Analytics – Sternen Portal",
  description: "Reservations- und Betriebskennzahlen.",
};

const VALID_PERIODS: AnalyticsPeriod[] = ["day", "week", "month", "season", "year", "custom"];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = await requireDemoSession();
  const params = await searchParams;

  const periodParam = typeof params.period === "string" ? params.period : "month";
  const period: AnalyticsPeriod = VALID_PERIODS.includes(periodParam as AnalyticsPeriod)
    ? (periodParam as AnalyticsPeriod)
    : "month";
  const today = format(new Date(), "yyyy-MM-dd");
  const customFrom = typeof params.from === "string" ? params.from : today;
  const customTo = typeof params.to === "string" ? params.to : today;

  const [data, notifications] = await Promise.all([
    getAnalytics(period, customFrom, customTo),
    notificationRepository.findAll(),
  ]);

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Analytics"
      description={`Auswertung ${data.range.from} bis ${data.range.to}`}
      actions={<AnalyticsExportActions role={user.role} />}
    >
      <AnalyticsPeriodSelect period={period} from={customFrom} to={customTo} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Reservationen" value={data.totals.reservations} comparison={data.previousPeriod.deltaPct} />
        <MetricCard label="Erwartete Gäste" value={data.totals.expectedGuests} />
        <MetricCard label="Ø Personen/Reservation" value={data.totals.averagePartySize} />
        <MetricCard label="Offen" value={data.totals.pending} />
        <MetricCard label="Bestätigt" value={data.totals.confirmed} />
        <MetricCard label="Abgeschlossen" value={data.totals.completed} />
        <MetricCard label="No-Show-Quote" value={`${data.totals.noShowRate}%`} />
        <MetricCard label="Wiederkehrende Gäste (geschätzt)" value={data.totals.estimatedReturningCustomers} />
      </div>

      {data.busiestDates.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-serif text-lg">Stärkste Tage</h3>
              <ul className="mt-3 space-y-1 text-sm">
                {data.busiestDates.map((d) => (
                  <li key={d.date} className="flex justify-between">
                    <span className="text-muted-foreground">{d.date}</span>
                    <span className="font-medium">{d.count} Reservationen</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-serif text-lg">Stärkste Zeiten</h3>
              <ul className="mt-3 space-y-1 text-sm">
                {data.busiestTimes.map((t) => (
                  <li key={t.time} className="flex justify-between">
                    <span className="text-muted-foreground">{t.time}</span>
                    <span className="font-medium">{t.count} Reservationen</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <AnalyticsCharts data={data} />
      </div>
    </StaffShell>
  );
}

function MetricCard({ label, value, comparison }: { label: string; value: string | number; comparison?: number | null }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-2 font-serif text-2xl text-foreground">{value}</p>
        {comparison !== undefined && comparison !== null && (
          <p className={`mt-1 text-xs ${comparison >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {comparison >= 0 ? "+" : ""}
            {comparison}% ggü. Vorperiode
          </p>
        )}
      </CardContent>
    </Card>
  );
}
