import type { Metadata } from "next";
import Link from "next/link";
import { StaffShell } from "@/components/staff/staff-shell";
import { StatusBadge } from "@/components/staff/status-badge";
import { ReservationFilters } from "@/components/staff/reservation-filters";
import { PaginationControls } from "@/components/staff/pagination-controls";
import { NewReservationDialog } from "@/components/staff/new-reservation-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireDemoSession } from "@/lib/demo-session";
import { reservationRepository } from "@/repositories/reservation-repository";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";
import { notificationRepository } from "@/repositories/notification-repository";
import type { Reservation, ReservationSource, ReservationStatus } from "@/types";

export const metadata: Metadata = {
  title: "Reservierungen – Sternen Portal",
  description: "Alle Reservationen filtern, suchen und verwalten.",
};

const PAGE_SIZE = 8;

export default async function ReservierungenPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { user } = await requireDemoSession();
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? (params.status as ReservationStatus) : undefined;
  const area = typeof params.area === "string" ? params.area : undefined;
  const source = typeof params.source === "string" ? (params.source as ReservationSource) : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "date-asc";
  const page = Math.max(1, Number(params.page) || 1);

  const [rows, seatingAreas, notifications] = await Promise.all([
    reservationRepository.findMany({
      search: q || undefined,
      status: status ? [status] : undefined,
      seatingAreaId: area,
      source,
    }),
    seatingAreaRepository.findMany(),
    notificationRepository.findAll(),
  ]);

  const sorted = sortReservations(rows, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <StaffShell
      user={user}
      notifications={notifications}
      title="Reservierungen"
      description="Alle Reservationen im Überblick"
    >
      <Card>
        <CardContent className="p-4">
          <ReservationFilters seatingAreas={seatingAreas} />
        </CardContent>
      </Card>

      <div className="mt-4">
        <NewReservationDialog seatingAreas={seatingAreas} currentUserId={user.id} />
      </div>

      <Card className="mt-4">
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Zeit</TableHead>
                  <TableHead>Gast</TableHead>
                  <TableHead>Personen</TableHead>
                  <TableHead>Bereich</TableHead>
                  <TableHead>Quelle</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      Keine Reservationen gefunden.
                    </TableCell>
                  </TableRow>
                )}
                {pageRows.map((r) => {
                  const rowArea = seatingAreas.find((a) => a.id === r.seatingAreaId);
                  return (
                    <TableRow key={r.id} className="cursor-pointer">
                      <TableCell className="p-0">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block px-4 py-3">
                          {r.date}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block px-4 py-3">
                          {r.time}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block px-4 py-3">
                          <div className="font-medium">
                            {r.customer.firstName} {r.customer.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">{r.reservationNumber}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block px-4 py-3">
                          {r.partySize}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block px-4 py-3">
                          {rowArea?.name ?? <span className="text-muted-foreground">—</span>}
                        </Link>
                      </TableCell>
                      <TableCell className="p-0 text-xs text-muted-foreground">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block px-4 py-3">
                          {r.source}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Link href={`/staff/reservierungen/${r.id}`} className="block">
                          <StatusBadge status={r.status} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {pageRows.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">Keine Reservationen gefunden.</p>
            )}
            {pageRows.map((r) => (
              <Link key={r.id} href={`/staff/reservierungen/${r.id}`} className="block p-4 hover:bg-muted/40">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {r.customer.firstName} {r.customer.lastName}
                  </p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.date} · {r.time} · {r.partySize} Pers.
                </p>
              </Link>
            ))}
          </div>
          <PaginationControls page={page} totalPages={totalPages} />
        </CardContent>
      </Card>
    </StaffShell>
  );
}

function sortReservations(rows: Reservation[], sort: string): Reservation[] {
  const copy = [...rows];
  switch (sort) {
    case "date-desc":
      return copy.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    case "created-desc":
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "partySize-desc":
      return copy.sort((a, b) => b.partySize - a.partySize);
    case "date-asc":
    default:
      return copy.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }
}
