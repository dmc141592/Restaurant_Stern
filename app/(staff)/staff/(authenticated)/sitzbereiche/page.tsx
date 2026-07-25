import type { Metadata } from "next";
import { format, addDays } from "date-fns";
import { StaffShell } from "@/components/staff/staff-shell";
import { SeatingAreaCard } from "@/components/staff/seating-area-card";
import { SeatingAreaCreateDialog } from "@/components/staff/seating-area-create-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { requireDemoSession } from "@/lib/demo-session";
import { can } from "@/lib/permissions";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import { reservationRepository } from "@/repositories/reservation-repository";
import { notificationRepository } from "@/repositories/notification-repository";

export const metadata: Metadata = {
  title: "Sitzbereiche – Sternen Portal",
  description: "Sitzbereiche und Kapazitäten verwalten.",
};

export default async function SitzbereichePage() {
  const { user } = await requireDemoSession();
  const today = format(new Date(), "yyyy-MM-dd");
  const in14Days = format(addDays(new Date(), 14), "yyyy-MM-dd");

  const [areas, upcomingReservations, notifications] = await Promise.all([
    seatingAreaRepository.findMany(),
    reservationRepository.findMany({ from: today, to: in14Days }),
    notificationRepository.findAll(),
  ]);

  const nextWeek = Array.from({ length: 7 }, (_, i) => format(addDays(new Date(), i), "yyyy-MM-dd"));

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Sitzbereiche"
      description="Räume, Kapazitäten und Verfügbarkeit"
      actions={
        can(user.role, "seating.manage") ? (
          <SeatingAreaCreateDialog nextDisplayOrder={areas.length + 1} currentUserId={user.id} />
        ) : undefined
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {areas.map((a, i) => (
          <SeatingAreaCard
            key={a.id}
            area={a}
            role={user.role}
            futureReservationCount={upcomingReservations.filter((r) => r.seatingAreaId === a.id).length}
            prevArea={areas[i - 1]}
            nextArea={areas[i + 1]}
            currentUserId={user.id}
          />
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <h2 className="font-serif text-xl">Kapazitätsübersicht — nächste 7 Tage</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-4">Datum</th>
                  <th className="py-2 pr-4">Gebuchte Gäste</th>
                  <th className="py-2 pr-4">Offene Kapazität</th>
                  <th className="py-2">Auslastung</th>
                </tr>
              </thead>
              <tbody>
                {nextWeek.map((date) => {
                  const dayReservations = upcomingReservations.filter(
                    (r) => r.date === date && r.status !== "CANCELLED" && r.status !== "NO_SHOW",
                  );
                  const booked = dayReservations.reduce((s, r) => s + r.partySize, 0);
                  const capacity = areas.filter((a) => a.currentlyOpen).reduce((s, a) => s + a.capacity, 0);
                  const pct = capacity > 0 ? Math.round((booked / capacity) * 100) : 0;
                  return (
                    <tr key={date} className="border-b border-border/70">
                      <td className="py-2 pr-4">{date}</td>
                      <td className="py-2 pr-4">{booked}</td>
                      <td className="py-2 pr-4">{Math.max(0, capacity - booked)}</td>
                      <td className="py-2">
                        <span className={pct >= 90 ? "font-medium text-destructive" : "text-muted-foreground"}>{pct}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </StaffShell>
  );
}
