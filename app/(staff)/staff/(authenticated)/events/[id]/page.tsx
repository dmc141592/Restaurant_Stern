import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StaffShell } from "@/components/staff/staff-shell";
import { EventDetailPanel } from "@/components/staff/event-detail-panel";
import { AuditMeta } from "@/components/staff/audit-meta";
import { AuditTimeline } from "@/components/staff/audit-timeline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireDemoSession } from "@/lib/demo-session";
import { can } from "@/lib/permissions";
import { eventRepository } from "@/repositories/event-repository";
import { notificationRepository } from "@/repositories/notification-repository";
import { userRepository } from "@/repositories/user-repository";
import { auditLogRepository } from "@/repositories/audit-log-repository";

export const metadata: Metadata = {
  title: "Event – Sternen Portal",
  description: "Event bearbeiten und verwalten.",
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireDemoSession();

  const event = await eventRepository.findById(id);
  if (!event) notFound();

  const canSeeFullHistory = can(user.role, "audit.viewAll");

  const [notifications, allUsers, changeHistory] = await Promise.all([
    notificationRepository.findAll(),
    userRepository.findMany(),
    canSeeFullHistory ? auditLogRepository.findByEntity("Event", event.id) : Promise.resolve([]),
  ]);

  const userName = (uid?: string) => {
    const u = allUsers.find((candidate) => candidate.id === uid);
    return u ? `${u.firstName} ${u.lastName}` : undefined;
  };

  return (
    <StaffShell user={user} notifications={notifications} title={event.title}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/staff/events">
          <ArrowLeft className="mr-1 h-4 w-4" /> Zurück
        </Link>
      </Button>
      <EventDetailPanel event={event} role={user.role} userId={user.id} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-start-3">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg">Verlauf</h3>
            <div className="mt-3">
              <AuditMeta
                createdByName={userName(event.createdBy)}
                createdAt={event.createdAt}
                updatedByName={userName(event.updatedBy)}
                updatedAt={event.updatedAt}
              />
            </div>
            {event.deletedAt && (
              <p className="mt-3 text-xs text-muted-foreground">
                Gelöscht {new Date(event.deletedAt).toLocaleString("de-CH")}
              </p>
            )}
          </CardContent>
        </Card>

        {canSeeFullHistory && (
          <Card className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg">Änderungsverlauf</h3>
              <p className="text-xs text-muted-foreground">Nur für Administratoren sichtbar.</p>
              <div className="mt-4">
                <AuditTimeline entries={changeHistory} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StaffShell>
  );
}
