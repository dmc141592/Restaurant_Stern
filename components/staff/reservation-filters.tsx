"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABELS } from "@/components/staff/status-badge";
import type { ReservationSource, ReservationStatus, SeatingArea } from "@/types";

const SOURCE_LABELS: Record<ReservationSource, string> = {
  WEBSITE: "Website",
  TELEPHONE: "Telefon",
  EMAIL: "E-Mail",
  WALK_IN: "Walk-in",
  STAFF_ENTRY: "Manuell erfasst",
};

const SORT_OPTIONS = [
  { value: "date-asc", label: "Datum (aufsteigend)" },
  { value: "date-desc", label: "Datum (absteigend)" },
  { value: "created-desc", label: "Neu erstellt zuerst" },
  { value: "partySize-desc", label: "Personenzahl (gross → klein)" },
] as const;

// Every control here writes to the URL's search params, so the actual data
// read happens server-side in page.tsx (no client-side fetching / no
// React Query for what's ultimately a plain server-rendered list read).
export function ReservationFilters({ seatingAreas }: { seatingAreas: SeatingArea[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => router.push(`/staff/reservierungen?${params.toString()}`));
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_repeat(4,auto)]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Name, E-Mail, Telefon, Reservationsnummer…"
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("q", q);
          }}
          onBlur={() => updateParam("q", q)}
          aria-label="Reservationen durchsuchen"
        />
      </div>
      <Select defaultValue={searchParams.get("status") ?? "ALL"} onValueChange={(v) => updateParam("status", v)}>
        <SelectTrigger className="w-full lg:w-40" aria-label="Nach Status filtern">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Alle Status</SelectItem>
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("area") ?? "ALL"} onValueChange={(v) => updateParam("area", v)}>
        <SelectTrigger className="w-full lg:w-40" aria-label="Nach Bereich filtern">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Alle Bereiche</SelectItem>
          {seatingAreas.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("source") ?? "ALL"} onValueChange={(v) => updateParam("source", v)}>
        <SelectTrigger className="w-full lg:w-40" aria-label="Nach Quelle filtern">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Alle Quellen</SelectItem>
          {(Object.keys(SOURCE_LABELS) as ReservationSource[]).map((s) => (
            <SelectItem key={s} value={s}>
              {SOURCE_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("sort") ?? "date-asc"} onValueChange={(v) => updateParam("sort", v)}>
        <SelectTrigger className="w-full lg:w-48" aria-label="Sortierung">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
