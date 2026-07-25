import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarClock,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserX,
  CalendarDays,
  Armchair,
  Cake,
  MessageSquare,
  Phone,
} from "lucide-react";
import { StaffShell } from "@/components/staff/staff-shell";
import { StatusBadge } from "@/components/staff/status-badge";
import { NewReservationDialog } from "@/components/staff/new-reservation-dialog";
import { QuickStatusSelect } from "@/components/staff/quick-status-select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireDemoSession } from "@/lib/demo-session";
import { can } from "@/lib/permissions";
import { reservationRepository } from "@/repositories/reservation-repository";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import { notificationRepository } from "@/repositories/notification-repository";
import { getDashboardStatistics } from "@/repositories/dashboard-service";

export const metadata: Metadata = {
  title: "Dashboard – Sternen Portal",
  description: "Übersicht der heutigen Reservationen und Kennzahlen.",
};

export default async function DashboardPage() {
  const { user } = await requireDemoSession();
  const today = format(new Date(), "yyyy-MM-dd");

  const [stats, todaysReservations, seatingAreas, notifications] = await Promise.all([
    getDashboardStatistics(today),
    reservationRepository.findMany({ from: today, to: today }),
    seatingAreaRepository.findMany(),
    notificationRepository.findAll(),
  ]);

  const sorted = [...todaysReservations].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Dashboard"
      description={`Heute · ${format(new Date(), "EEEE, dd.MM.yyyy")}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CalendarClock} label="Reservationen heute" value={stats.todayCount} tone="primary" />
        <Stat icon={Users} label="Erwartete Gäste" value={stats.expectedGuestsToday} tone="accent" />
        <Stat icon={AlertCircle} label="Offene Anfragen" value={stats.pendingCount} tone="warn" />
        <Stat icon={CheckCircle2} label="Bestätigt" value={stats.confirmedCount} tone="ok" />
        <Stat icon={XCircle} label="Stornierungen" value={stats.cancelledCount} tone="danger" />
        <Stat icon={UserX} label="No-Shows" value={stats.noShowCount} tone="danger" />
        <Stat icon={CalendarDays} label="Kommende Events" value={stats.upcomingEvents} tone="primary" />
        <Stat icon={Armchair} label="Freie Kapazität" value={stats.availableCapacityToday} tone="ok" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-serif text-xl">Heute im Betrieb</h2>
                <p className="text-xs text-muted-foreground">Chronologische Ansicht der heutigen Reservationen</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/staff/reservierungen">Alle öffnen</Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {sorted.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">Heute keine Reservationen.</div>
              )}
              {sorted.map((r) => {
                const area = seatingAreas.find((a) => a.id === r.seatingAreaId);
                const isBirthday = r.occasion === "BIRTHDAY";
                const isLarge = r.partySize >= 8;
                return (
                  <div key={r.id} className="grid grid-cols-[64px_1fr_auto_auto] items-center gap-4 p-4">
                    <Link href={`/staff/reservierungen/${r.id}`} className="text-center hover:underline">
                      <div className="font-serif text-lg text-primary">{r.time}</div>
                      <div className="text-[10px] uppercase text-muted-foreground">{r.partySize} Pers.</div>
                    </Link>
                    <div className="min-w-0">
                      <Link href={`/staff/reservierungen/${r.id}`} className="block hover:underline">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">
                            {r.customer.firstName} {r.customer.lastName}
                          </p>
                          {isBirthday && (
                            <Badge variant="secondary" className="gap-1">
                              <Cake className="h-3 w-3" />
                              Geburtstag
                            </Badge>
                          )}
                          {isLarge && <Badge variant="secondary">Grosse Gruppe</Badge>}
                          {r.message && <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />}
                          {!area && (
                            <Badge variant="outline" className="border-amber-300 text-amber-700">
                              Ohne Bereich
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {area?.name ?? "Bereich offen"} ·{" "}
                        <a href={`tel:${r.customer.phone}`} className="hover:underline">
                          <Phone className="mr-0.5 inline h-3 w-3" />
                          {r.customer.phone}
                        </a>
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                    <QuickStatusSelect reservationId={r.id} status={r.status} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="font-serif text-xl">Schnellaktionen</h2>
            <div className="mt-4 space-y-2">
              <NewReservationDialog seatingAreas={seatingAreas} />
              {can(user.role, "event.create") && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/staff/events/new">Event erstellen</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/staff/reservierungen">Heutige Reservationen</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/staff/sitzbereiche">Sitzbereiche verwalten</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/staff/analytics">Statistiken ansehen</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof CalendarClock;
  label: string;
  value: number | string;
  tone?: "primary" | "accent" | "warn" | "ok" | "danger";
}) {
  const toneMap: Record<string, string> = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent-foreground bg-accent/30",
    warn: "text-amber-900 bg-amber-100",
    ok: "text-emerald-900 bg-emerald-100",
    danger: "text-rose-900 bg-rose-100",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <span className={`grid h-8 w-8 place-items-center rounded-md ${toneMap[tone]}`}>
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 font-serif text-3xl text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
