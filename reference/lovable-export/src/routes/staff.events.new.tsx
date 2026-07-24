import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StaffShell } from "@/components/staff/StaffShell";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { eventRepository } from "@/repositories";
import { useAuth } from "@/services/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/events/new")({
  head: () => ({
    meta: [
      { title: "Event erstellen – Sternen Portal" },
      { name: "description", content: "Neuen Anlass anlegen." },
      { property: "og:title", content: "Event erstellen – Sternen Portal" },
      { property: "og:description", content: "Formular für ein neues Event." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Zahlen, Bindestriche"),
  shortDescription: z.string().min(4).max(160),
  fullDescription: z.string().min(4),
  startDate: z.string().min(1),
  startTime: z.string().min(1),
  endDate: z.string().min(1),
  endTime: z.string().min(1),
  capacity: z.coerce.number().optional(),
  reservationRequired: z.boolean(),
  visibility: z.enum(["PUBLIC", "STAFF_ONLY"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

function Page() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { reservationRequired: true, visibility: "PUBLIC", status: "DRAFT" },
  });

  const onSubmit = handleSubmit(async (v) => {
    if (!user) return;
    await eventRepository.create({ ...v, createdBy: user.id, updatedBy: user.id });
    toast.success("Event erstellt");
    nav({ to: "/staff/events" });
  });

  return (
    <StaffShell title="Neues Event" description="Legen Sie einen neuen Anlass an">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titel" error={errors.title?.message}><Input {...register("title")} /></Field>
              <Field label="Slug" error={errors.slug?.message}><Input {...register("slug")} placeholder="mein-event" /></Field>
              <Field label="Kurzbeschreibung" className="sm:col-span-2" error={errors.shortDescription?.message}>
                <Input {...register("shortDescription")} />
              </Field>
              <Field label="Beschreibung" className="sm:col-span-2" error={errors.fullDescription?.message}>
                <Textarea rows={5} {...register("fullDescription")} />
              </Field>
              <Field label="Startdatum" error={errors.startDate?.message}><Input type="date" {...register("startDate")} /></Field>
              <Field label="Startzeit" error={errors.startTime?.message}><Input type="time" {...register("startTime")} /></Field>
              <Field label="Enddatum" error={errors.endDate?.message}><Input type="date" {...register("endDate")} /></Field>
              <Field label="Endzeit" error={errors.endTime?.message}><Input type="time" {...register("endTime")} /></Field>
              <Field label="Kapazität (optional)"><Input type="number" {...register("capacity")} /></Field>
              <Field label="Sichtbarkeit">
                <Controller name="visibility" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Öffentlich</SelectItem>
                      <SelectItem value="STAFF_ONLY">Nur Team</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </Field>
              <div className="flex items-center gap-2">
                <Controller name="reservationRequired" control={control} render={({ field }) => (
                  <Checkbox id="rr" checked={!!field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                )} />
                <Label htmlFor="rr">Reservation erforderlich</Label>
              </div>
              <Field label="Status">
                <Controller name="status" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Entwurf</SelectItem>
                      <SelectItem value="PUBLISHED">Veröffentlicht</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </Field>
            </div>
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              Bild-Upload: Vorschau lokal (Prototyp). In der produktiven Version über Cloud-Storage.
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => nav({ to: "/staff/events" })}>Abbrechen</Button>
              <Button type="submit" disabled={isSubmitting}>Event speichern</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </StaffShell>
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
