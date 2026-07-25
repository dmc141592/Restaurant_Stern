"use client";

import { useState } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reservationRepository } from "@/repositories/reservation-repository";
import type { Reservation, ReservationOccasion, SeatingArea } from "@/types";

// Client-side validation only covers UX (fast feedback, fewer round trips).
// FUTURE REPLACEMENT POINT: once this form submits through a Server Action,
// the same shape must be re-validated with Zod on the server before it ever
// reaches Prisma — never trust this schema alone as the integrity boundary.
const schema = z.object({
  date: z
    .string()
    .min(1, "Bitte Datum wählen")
    .refine(
      (d) => new Date(d) >= new Date(new Date().toDateString()),
      "Datum darf nicht in der Vergangenheit liegen",
    ),
  time: z.string().min(1, "Bitte Zeit wählen"),
  partySize: z.coerce.number().int().min(1, "Mindestens 1 Person").max(30, "Für Gruppen ab 30 bitte anrufen"),
  seatingAreaId: z.string().optional(),
  firstName: z.string().min(1, "Bitte Vornamen angeben"),
  lastName: z.string().min(1, "Bitte Nachnamen angeben"),
  email: z.email("Bitte gültige E-Mail-Adresse"),
  phone: z
    .string()
    .min(6, "Bitte Telefonnummer angeben")
    .regex(/^[+0-9\s().-]{6,}$/, "Ungültiges Telefonformat"),
  occasion: z.enum(["NORMAL", "BIRTHDAY", "BUSINESS", "FAMILY", "ANNIVERSARY", "OTHER"]),
  message: z.string().max(500).optional(),
  privacy: z.literal(true, "Bitte Datenschutz bestätigen"),
});

// `partySize` uses z.coerce.number(), so the pre-validation input type (what
// register()/defaultValues deal in) differs from the post-validation output
// type (what the submit handler receives) — hence two distinct types here.
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const OCCASIONS: { value: ReservationOccasion; label: string }[] = [
  { value: "NORMAL", label: "Normaler Besuch" },
  { value: "BIRTHDAY", label: "Geburtstag" },
  { value: "BUSINESS", label: "Geschäftsessen" },
  { value: "FAMILY", label: "Familienfeier" },
  { value: "ANNIVERSARY", label: "Jubiläum" },
  { value: "OTHER", label: "Anderer Anlass" },
];

export function ReservationForm({ seatingAreas }: { seatingAreas: SeatingArea[] }) {
  const [result, setResult] = useState<Reservation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2, occasion: "NORMAL" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
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
      const message = "Reservation konnte nicht übermittelt werden. Bitte später erneut versuchen.";
      setSubmitError(message);
      toast.error(message);
    }
  });

  if (result) {
    return (
      <div className="mt-10 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-serif text-3xl text-primary">Vielen Dank!</h2>
        <p className="mt-2 text-muted-foreground">
          Wir haben Ihre Reservationsanfrage erhalten und melden uns zur Bestätigung.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-md border border-border bg-muted/40 p-4 text-left text-sm">
          <p>
            <span className="text-muted-foreground">Referenz:</span> {result.reservationNumber}
          </p>
          <p>
            <span className="text-muted-foreground">Datum:</span> {result.date} um {result.time}
          </p>
          <p>
            <span className="text-muted-foreground">Personen:</span> {result.partySize}
          </p>
          <p>
            <span className="text-muted-foreground">Name:</span> {result.customer.firstName}{" "}
            {result.customer.lastName}
          </p>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5" />
          Demo-Prototyp: es wurde keine echte Reservation gesendet.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => setResult(null)}>
            Weitere Reservation
          </Button>
          <a
            href="tel:+41000000000"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Anrufen
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 space-y-8 rounded-lg border border-border bg-card p-6 sm:p-8">
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-2 text-sm font-semibold text-foreground">Wann &amp; wie viele?</legend>
        <Field id="date" label="Datum" error={errors.date?.message}>
          <Input type="date" {...register("date")} {...a11y("date", errors)} />
        </Field>
        <Field id="time" label="Zeit" error={errors.time?.message}>
          <Input type="time" {...register("time")} {...a11y("time", errors)} />
        </Field>
        <Field id="partySize" label="Personen" error={errors.partySize?.message}>
          <Input type="number" min={1} max={30} {...register("partySize")} {...a11y("partySize", errors)} />
        </Field>
        <Field id="seatingAreaId" label="Bevorzugter Bereich (optional)" className="sm:col-span-3">
          <Controller
            control={control}
            name="seatingAreaId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="seatingAreaId">
                  <SelectValue placeholder="Egal" />
                </SelectTrigger>
                <SelectContent>
                  {seatingAreas.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-semibold text-foreground">Ihre Kontaktdaten</legend>
        <Field id="firstName" label="Vorname" error={errors.firstName?.message}>
          <Input {...register("firstName")} {...a11y("firstName", errors)} />
        </Field>
        <Field id="lastName" label="Nachname" error={errors.lastName?.message}>
          <Input {...register("lastName")} {...a11y("lastName", errors)} />
        </Field>
        <Field id="email" label="E-Mail" error={errors.email?.message}>
          <Input type="email" {...register("email")} {...a11y("email", errors)} />
        </Field>
        <Field id="phone" label="Telefon" error={errors.phone?.message}>
          <Input type="tel" placeholder="+41 ..." {...register("phone")} {...a11y("phone", errors)} />
        </Field>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold text-foreground">Anlass</legend>
        <Field id="occasion" label="Anlass">
          <Controller
            control={control}
            name="occasion"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="occasion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field id="message" label="Mitteilung (optional)" error={errors.message?.message}>
          <Textarea
            rows={4}
            placeholder="Wünsche, Allergien, Kinderstuhl, …"
            {...register("message")}
            {...a11y("message", errors)}
          />
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
              aria-invalid={!!errors.privacy || undefined}
              aria-describedby={errors.privacy ? "privacy-error" : undefined}
            />
          )}
        />
        <div>
          <Label htmlFor="privacy" className="text-sm">
            Ich akzeptiere die{" "}
            <a href="/datenschutz" className="underline">
              Datenschutzerklärung
            </a>
            .
          </Label>
          {errors.privacy && (
            <p id="privacy-error" role="alert" className="mt-1 text-xs text-destructive">
              {errors.privacy.message}
            </p>
          )}
        </div>
      </div>

      {submitError && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Demo-Prototyp – es wird keine echte Reservation gesendet.</p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Wird gesendet …" : "Reservation anfragen"}
        </Button>
      </div>
    </form>
  );
}

function a11y(name: keyof FormInput, errors: FieldErrors<FormInput>) {
  const hasError = Boolean(errors[name]);
  return {
    id: name,
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? `${name}-error` : undefined,
  } as const;
}

function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-sm">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
