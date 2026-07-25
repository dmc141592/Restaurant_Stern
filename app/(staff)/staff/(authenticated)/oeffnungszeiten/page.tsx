import type { Metadata } from "next";
import { StaffShell } from "@/components/staff/staff-shell";
import { OpeningHoursEditor } from "@/components/staff/opening-hours-editor";
import { SpecialDatesEditor } from "@/components/staff/special-dates-editor";
import { requireDemoSession } from "@/lib/demo-session";
import { can } from "@/lib/permissions";
import { openingHoursRepository } from "@/repositories/opening-hours-repository";
import { notificationRepository } from "@/repositories/notification-repository";

export const metadata: Metadata = {
  title: "Öffnungszeiten – Sternen Portal",
  description: "Reguläre Öffnungszeiten und Spezialtage.",
};

export default async function OeffnungszeitenPage() {
  const { user } = await requireDemoSession();
  const canEdit = can(user.role, "opening.manage");

  const [weekly, special, notifications] = await Promise.all([
    openingHoursRepository.getWeeklyHours(),
    openingHoursRepository.getSpecialDates(),
    notificationRepository.findAll(),
  ]);

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Öffnungszeiten"
      description="Reguläre Woche und ausserordentliche Tage"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <OpeningHoursEditor weekly={weekly} canEdit={canEdit} />
        <SpecialDatesEditor special={special} canEdit={canEdit} />
      </div>
    </StaffShell>
  );
}
