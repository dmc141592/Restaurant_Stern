import { MapPin, Clock, Phone } from "lucide-react";
import { openingHoursRepository } from "@/repositories/opening-hours-repository";
import { getTodayOpeningStatus } from "@/lib/opening-hours";

// Sits directly under the hero — moved out of it so the hero itself stays
// uncluttered. Reads live from the same opening-hours repository the staff
// portal edits and the homepage's weekly preview uses.
export async function InfoStrip() {
  const hours = await openingHoursRepository.getWeeklyHours();
  const status = getTodayOpeningStatus(hours);

  return (
    <section className="border-b border-border bg-card">
      <div className="container-page grid gap-6 py-6 sm:grid-cols-3">
        <InfoItem icon={MapPin} label="Albisriederstrasse, 8047 Zürich" />
        <InfoItem icon={Clock} label={status.label} />
        <InfoItem icon={Phone} label="+41 00 000 00 00" />
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </div>
  );
}
