import type { Metadata } from "next";
import { ReservationForm } from "@/components/public/reservation-form";
import { seatingAreaRepository } from "@/repositories/seating-area-repository";

export const metadata: Metadata = {
  title: "Tisch reservieren – Sternen Albisrieden",
  description: "Reservieren Sie online Ihren Tisch im Restaurant, Gartenrestaurant oder Sääli.",
};

export default async function ReservationPage() {
  const seatingAreas = await seatingAreaRepository.findMany();
  const bookableAreas = seatingAreas.filter((a) => a.publiclyBookable);

  return (
    <section className="container-page max-w-3xl py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Reservation</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Tisch reservieren</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Bitte füllen Sie das Formular aus. Wir bestätigen jede Anfrage persönlich – für Gruppen ab 8 Personen
        rufen Sie uns bitte an.
      </p>
      <ReservationForm seatingAreas={bookableAreas} />
    </section>
  );
}
