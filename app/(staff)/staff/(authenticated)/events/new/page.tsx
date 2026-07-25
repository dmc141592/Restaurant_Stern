import type { Metadata } from "next";
import { StaffShell } from "@/components/staff/staff-shell";
import { EventForm } from "@/components/staff/event-form";
import { requireDemoSession } from "@/lib/demo-session";
import { notificationRepository } from "@/repositories/notification-repository";

export const metadata: Metadata = {
  title: "Event erstellen – Sternen Portal",
  description: "Neuen Anlass anlegen.",
};

export default async function NewEventPage() {
  const { user } = await requireDemoSession();
  const notifications = await notificationRepository.findAll();

  return (
    <StaffShell user={user} notifications={notifications} title="Neues Event" description="Legen Sie einen neuen Anlass an">
      <EventForm mode="create" userId={user.id} />
    </StaffShell>
  );
}
