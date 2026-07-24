import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reservationRepository } from "@/repositories";
import { mockSeatingAreas } from "@/data/mock";
import type { Reservation, ReservationOccasion } from "@/types";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Tisch reservieren – Sternen Albisrieden" },
      { name: "description", content: "Reservieren Sie online Ihren Tisch im Restaurant, Gartenrestaurant oder Sääli." },
      { property: "og:title", content: "Tisch reservieren – Sternen Albisrieden" },
      { property: "og:description", content: "Online-Reservationsanfrage – wir bestätigen jede Anfrage persönlich." },
    ],
  }),
  component: Page,
});

// NOTE: This mock service will later be replaced with a Next.js Server Action
// that calls the Prisma-backed ReservationRepository and sends confirmation email.
const schema = z.object({
  date: z.string().min(1, "Bitte Datum wählen").refine(
    (d) => new Date(d) >= new Date(new Date().toDateString()),
    "Datum darf nicht in der Vergangenheit liegen",
  ),
  time: z.string().min(1, "Bitte Zeit wählen"),
  partySize: z.coerce.number().int().min(1, "Mindestens 1 Person").max(30, "Für Gruppen ab 30 bitte anrufen"),
  seatingAreaId: z.string().optional(),
  firstName: z.string().min(1, "Bitte Vornamen angeben"),
  lastName: z.string().min(1, "Bitte Nachnamen angeben"),
  email: z.string().email("Bitte gültige E-Mail-Adresse"),
  phone: z.string().min(6, "Bitte Telefonnummer angeben").regex(/^[+0-9\s().-]{6,}$/, "Ungültiges Telefonformat"),
  occasion: z.enum(["NORMAL", "BIRTHDAY", "BUSINESS", "FAMILY", "ANNIVERSARY", "OTHER"]),
  message: z.string().max(500).optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: "Bitte Datenschutz bestätigen" }) }),
});

type FormValues = z.infer<typeof schema>;

const OCCASIONS: { value: ReservationOccasion; label: string }[] = [
  { value: "NORMAL", label: "Normaler Besuch" },
  { value: "BIRTHDAY", label: "Geburtstag" },
  { value: "BUSINESS", label: "Geschäftsessen" },
  { value: "FAMILY", label: "Familienfeier" },
  { value: "ANNIVERSARY", label: "Jubiläum" },
  { value: "OTHER", label: "Anderer Anlass" },
];

function Page() {
  const [result, setResult] = useState<Reservation | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2, occasion: "NORMAL" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const r = await reservationRepository.create({
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        seatingAreaId: data.seatingAreaId || undefined,
        customer: {
          id: crypto.randomUUID(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
        occasion: data.occasion,
        message: data.message,
        source: "WEBSITE",
      });
      setResult(r);
      reset();
    } catch {
      toast.error("Reservation konnte nicht übermittelt werden. Bitte später erneut versuchen.");
    }
  });

  if (result) {
    return (
      <PublicShell>
        <section className="container-page max-w-2xl py-24">
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 font-serif text-3xl text-primary">Vielen Dank!</h1>
            <p className="mt-2 text-muted-foreground">
              Wir haben Ihre Reservationsanfrage erhalten und melden uns zur Bestätigung.
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-md border border-border bg-muted/40 p-4 text-left text-sm">
              <p><span className="text-muted-foreground">Referenz:</span> {result.reservationNumber}</p>
              <p><span className="text-muted-foreground">Datum:</span> {result.date} um {result.time}</p>
              <p><span className="text-muted-foreground">Personen:</span> {result.partySize}</p>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5" />
              Demo-Prototyp: es wurde keine echte Reservation gesendet.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setResult(null)}>Weitere Reservation</Button>
              <a href="tel:+41000000000" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Anrufen</a>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className="container-page max-w-3xl py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Reservation</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Tisch reservieren</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Bitte füllen Sie das Formular aus. Wir bestätigen jede Anfrage persönlich – für Gruppen ab 8 Personen rufen Sie uns bitte an.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-8 rounded-lg border border-border bg-card p-6 sm:p-8">
          <fieldset className="grid gap-4 sm:grid-cols-3">
            <legend className="mb-2 text-sm font-semibold text-foreground">Wann & wie viele?</legend>
            <Field label="Datum" error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </Field>
            <Field label="Zeit" error={errors.time?.message}>
              <Input type="time" {...register("time")} />
            </Field>
            <Field label="Personen" error={errors.partySize?.message}>
              <Input type="number" min={1} max={30} {...register("partySize")} />
            </Field>
            <Field label="Bevorzugter Bereich (optional)" className="sm:col-span-3">
              <Controller
                control={control}
                name="seatingAreaId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Egal" /></SelectTrigger>
                    <SelectContent>
                      {mockSeatingAreas.filter((s) => s.publiclyBookable).map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-semibold text-foreground">Ihre Kontaktdaten</legend>
            <Field label="Vorname" error={errors.firstName?.message}><Input {...register("firstName")} /></Field>
            <Field label="Nachname" error={errors.lastName?.message}><Input {...register("lastName")} /></Field>
            <Field label="E-Mail" error={errors.email?.message}><Input type="email" {...register("email")} /></Field>
            <Field label="Telefon" error={errors.phone?.message}><Input type="tel" {...register("phone")} placeholder="+41 ..." /></Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 text-sm font-semibold text-foreground">Anlass</legend>
            <Field label="Anlass">
              <Controller
                control={control}
                name="occasion"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OCCASIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Mitteilung (optional)" error={errors.message?.message}>
              <Textarea rows={4} placeholder="Wünsche, Allergien, Kinderstuhl, …" {...register("message")} />
            </Field>
          </fieldset>

          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="privacy"
              render={({ field }) => (
                <Checkbox
                  id="privacy"
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
              )}
            />
            <div>
              <Label htmlFor="privacy" className="text-sm">
                Ich akzeptiere die <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.
              </Label>
              {errors.privacy && <p className="mt-1 text-xs text-destructive">{errors.privacy.message}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Demo-Prototyp – es wird keine echte Reservation gesendet.
            </p>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Wird gesendet …" : "Reservation anfragen"}
            </Button>
          </div>
        </form>
      </section>
    </PublicShell>
  );
}

function Field({
  label, error, children, className,
}: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
