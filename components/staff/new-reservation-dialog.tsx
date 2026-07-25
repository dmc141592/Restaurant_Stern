"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reservationRepository } from "@/repositories/reservation-repository";
import type { ReservationOccasion, ReservationSource, SeatingArea } from "@/types";

const schema = z.object({
  date: z.string().min(1, "Bitte Datum wählen"),
  time: z.string().min(1, "Bitte Zeit wählen"),
  partySize: z.coerce.number().int().min(1, "Mindestens 1 Person").max(60, "Bitte Kapazität prüfen"),
  seatingAreaId: z.string().optional(),
  firstName: z.string().min(1, "Bitte Vornamen angeben"),
  lastName: z.string().min(1, "Bitte Nachnamen angeben"),
  phone: z.string().min(6, "Bitte Telefonnummer angeben"),
  email: z.string().optional(),
  occasion: z.enum(["NORMAL", "BIRTHDAY", "BUSINESS", "FAMILY", "ANNIVERSARY", "OTHER"]),
  source: z.enum(["TELEPHONE", "WALK_IN", "STAFF_ENTRY"]),
  message: z.string().max(500).optional(),
});

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

const SOURCES: { value: ReservationSource; label: string }[] = [
  { value: "TELEPHONE", label: "Telefon" },
  { value: "WALK_IN", label: "Walk-in" },
  { value: "STAFF_ENTRY", label: "Manuell erfasst" },
];

export function NewReservationDialog({ seatingAreas }: { seatingAreas: SeatingArea[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partySize: 2, occasion: "NORMAL", source: "TELEPHONE" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await reservationRepository.create({
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        seatingAreaId: data.seatingAreaId || undefined,
        customer: {
          id: crypto.randomUUID(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || "",
          phone: data.phone,
        },
        occasion: data.occasion,
        message: data.message,
        source: data.source,
        status: "CONFIRMED",
      });
      toast.success("Reservation erfasst");
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Reservation konnte nicht gespeichert werden.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Phone className="mr-2 h-4 w-4" /> Telefonische Reservation erfassen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservation manuell erfassen</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="date" label="Datum" error={errors.date?.message}>
              <Input type="date" {...register("date")} {...a11y("date", errors)} />
            </Field>
            <Field id="time" label="Zeit" error={errors.time?.message}>
              <Input type="time" {...register("time")} {...a11y("time", errors)} />
            </Field>
            <Field id="partySize" label="Personen" error={errors.partySize?.message}>
              <Input type="number" min={1} max={60} {...register("partySize")} {...a11y("partySize", errors)} />
            </Field>
            <Field id="seatingAreaId" label="Bereich (optional)">
              <Controller
                control={control}
                name="seatingAreaId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="seatingAreaId">
                      <SelectValue placeholder="Offen" />
                    </SelectTrigger>
                    <SelectContent>
                      {seatingAreas.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="Vorname" error={errors.firstName?.message}>
              <Input {...register("firstName")} {...a11y("firstName", errors)} />
            </Field>
            <Field id="lastName" label="Nachname" error={errors.lastName?.message}>
              <Input {...register("lastName")} {...a11y("lastName", errors)} />
            </Field>
            <Field id="phone" label="Telefon" error={errors.phone?.message}>
              <Input type="tel" {...register("phone")} {...a11y("phone", errors)} />
            </Field>
            <Field id="email" label="E-Mail (optional)" error={errors.email?.message}>
              <Input type="email" {...register("email")} {...a11y("email", errors)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field id="source" label="Quelle">
              <Controller
                control={control}
                name="source"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="source">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
          <Field id="message" label="Mitteilung (optional)">
            <Textarea rows={3} {...register("message")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Speichert…" : "Reservation speichern"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
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
