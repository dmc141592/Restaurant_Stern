"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { eventRepository } from "@/repositories/event-repository";
import type { RestaurantEvent } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Bitte Titel angeben"),
  slug: z.string().min(2, "Bitte Slug angeben").regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Zahlen, Bindestriche"),
  shortDescription: z.string().min(4, "Bitte Kurzbeschreibung angeben").max(160, "Maximal 160 Zeichen"),
  fullDescription: z.string().min(4, "Bitte Beschreibung angeben"),
  startDate: z.string().min(1, "Bitte Startdatum wählen"),
  startTime: z.string().min(1, "Bitte Startzeit wählen"),
  endDate: z.string().min(1, "Bitte Enddatum wählen"),
  endTime: z.string().min(1, "Bitte Endzeit wählen"),
  capacity: z.coerce.number().int().positive().optional(),
  bookingLink: z.string().optional(),
  reservationRequired: z.boolean(),
  visibility: z.enum(["PUBLIC", "STAFF_ONLY"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export function EventForm({
  mode,
  event,
  userId,
  onSaved,
}: {
  mode: "create" | "edit";
  event?: RestaurantEvent;
  userId: string;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl ?? null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: event
      ? {
          title: event.title,
          slug: event.slug,
          shortDescription: event.shortDescription,
          fullDescription: event.fullDescription,
          startDate: event.startDate,
          startTime: event.startTime,
          endDate: event.endDate,
          endTime: event.endTime,
          capacity: event.capacity,
          bookingLink: event.bookingLink,
          reservationRequired: event.reservationRequired,
          visibility: event.visibility,
          status: event.status === "ARCHIVED" || event.status === "CANCELLED" ? "DRAFT" : event.status,
        }
      : { reservationRequired: true, visibility: "PUBLIC", status: "DRAFT" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (mode === "edit" && event) {
        await eventRepository.update(event.id, { ...data, updatedBy: userId });
        toast.success("Event aktualisiert");
      } else {
        await eventRepository.create({ ...data, createdBy: userId, updatedBy: userId });
        toast.success("Event erstellt");
      }
      if (onSaved) {
        onSaved();
      } else {
        router.push("/staff/events");
      }
      router.refresh();
    } catch {
      toast.error("Event konnte nicht gespeichert werden.");
    }
  });

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="title" label="Titel" error={errors.title?.message}>
              <Input {...register("title")} {...a11y("title", errors)} />
            </Field>
            <Field id="slug" label="Slug" error={errors.slug?.message}>
              <Input {...register("slug")} placeholder="mein-event" {...a11y("slug", errors)} />
            </Field>
            <Field id="shortDescription" label="Kurzbeschreibung" className="sm:col-span-2" error={errors.shortDescription?.message}>
              <Input {...register("shortDescription")} {...a11y("shortDescription", errors)} />
            </Field>
            <Field id="fullDescription" label="Beschreibung" className="sm:col-span-2" error={errors.fullDescription?.message}>
              <Textarea rows={5} {...register("fullDescription")} {...a11y("fullDescription", errors)} />
            </Field>
            <Field id="startDate" label="Startdatum" error={errors.startDate?.message}>
              <Input type="date" {...register("startDate")} {...a11y("startDate", errors)} />
            </Field>
            <Field id="startTime" label="Startzeit" error={errors.startTime?.message}>
              <Input type="time" {...register("startTime")} {...a11y("startTime", errors)} />
            </Field>
            <Field id="endDate" label="Enddatum" error={errors.endDate?.message}>
              <Input type="date" {...register("endDate")} {...a11y("endDate", errors)} />
            </Field>
            <Field id="endTime" label="Endzeit" error={errors.endTime?.message}>
              <Input type="time" {...register("endTime")} {...a11y("endTime", errors)} />
            </Field>
            <Field id="capacity" label="Kapazität (optional)" error={errors.capacity?.message}>
              <Input type="number" {...register("capacity")} {...a11y("capacity", errors)} />
            </Field>
            <Field id="bookingLink" label="Externer Buchungslink (optional)" error={errors.bookingLink?.message}>
              <Input type="url" placeholder="https://…" {...register("bookingLink")} {...a11y("bookingLink", errors)} />
            </Field>
            <Field id="visibility" label="Sichtbarkeit">
              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Öffentlich</SelectItem>
                      <SelectItem value="STAFF_ONLY">Nur Team</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <div className="flex items-center gap-2 self-end pb-2">
              <Controller
                name="reservationRequired"
                control={control}
                render={({ field }) => (
                  <Checkbox id="rr" checked={!!field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                )}
              />
              <Label htmlFor="rr">Reservation erforderlich</Label>
            </div>
            <Field id="status" label="Status">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Entwurf</SelectItem>
                      <SelectItem value="PUBLISHED">Veröffentlicht</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="rounded-md border border-dashed p-4">
            <Label htmlFor="image" className="mb-2 block text-sm">
              Bild (nur lokale Vorschau — kein echter Upload in diesem Prototyp)
            </Label>
            <Input id="image" type="file" accept="image/*" onChange={onImageChange} />
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element -- local blob: preview only, next/image cannot optimize blob URLs
              <img src={imagePreview} alt="Vorschau des hochgeladenen Bilds" className="mt-3 max-h-48 rounded-md object-cover" />
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              In der produktiven Version über Cloud-Storage (z. B. Vercel Blob) mit echtem Upload.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/staff/events")}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Speichert…" : "Event speichern"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
