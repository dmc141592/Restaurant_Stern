import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StaffShell } from "@/components/staff/staff-shell";
import { EventDetailPanel } from "@/components/staff/event-detail-panel";
import { Button } from "@/components/ui/button";
import { requireDemoSession } from "@/lib/demo-session";
import { eventRepository } from "@/repositories/event-repository";
import { notificationRepository } from "@/repositories/notification-repository";

export const metadata: Metadata = {
  title: "Event – Sternen Portal",
  description: "Event bearbeiten und verwalten.",
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireDemoSession();

  const [event, notifications] = await Promise.all([eventRepository.findById(id), notificationRepository.findAll()]);
  if (!event) notFound();

  return (
    <StaffShell user={user} notifications={notifications} title={event.title}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/staff/events">
          <ArrowLeft className="mr-1 h-4 w-4" /> Zurück
        </Link>
      </Button>
      <EventDetailPanel event={event} role={user.role} userId={user.id} />
    </StaffShell>
  );
}
