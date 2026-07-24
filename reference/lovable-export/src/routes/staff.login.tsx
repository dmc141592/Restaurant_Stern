import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/services/auth";
import { Link } from "@tanstack/react-router";
import type { UserRole } from "@/types";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/staff/login")({
  head: () => ({
    meta: [
      { title: "Mitarbeiter-Login – Sternen Portal" },
      { name: "description", content: "Zugang zum Mitarbeiterbereich des Restaurants Sternen Albisrieden." },
      { property: "og:title", content: "Mitarbeiter-Login – Sternen Portal" },
      { property: "og:description", content: "Zugang zum internen Reservations- und Betriebsportal." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

const schema = z.object({
  email: z.string().email("Bitte gültige E-Mail"),
  password: z.string().min(1, "Bitte Passwort eingeben"),
  remember: z.boolean().optional(),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"]),
});

function Page() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string>();

  const {
    register, handleSubmit, control, formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: "MANAGER", email: "marco.frei@sternenalbisrieden.demo", password: "demo" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setErr(undefined);
    try {
      await signIn(data.email, data.password, data.role as UserRole);
      nav({ to: "/staff/dashboard" });
    } catch (e) {
      setErr("Anmeldung fehlgeschlagen.");
    }
  });

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl">Sternen</span>
          <span className="text-xs uppercase tracking-widest text-primary-foreground/60">Portal</span>
        </Link>
        <div>
          <h2 className="font-serif text-4xl leading-tight">Reservationen. Team. Betrieb.</h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Ihr internes Dashboard für den täglichen Betrieb im Sternen Albisrieden.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} Sternen Albisrieden · Demo-Prototyp</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 sm:p-8">
            <h1 className="font-serif text-3xl text-primary">Mitarbeiter-Anmeldung</h1>
            <p className="mt-1 text-sm text-muted-foreground">Willkommen zurück.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label>E-Mail</Label>
                <Input type="email" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Label>Passwort</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Controller control={control} name="remember" render={({ field }) => (
                    <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                  )} />
                  Angemeldet bleiben
                </label>
                <a href="#" className="text-primary hover:underline">Passwort vergessen?</a>
              </div>

              <div className="rounded-md border border-dashed border-border bg-muted/40 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Nur für die Design-Demo – wird später durch Auth.js ersetzt
                </p>
                <div className="mt-3">
                  <Label className="text-xs">Rolle simulieren</Label>
                  <Controller control={control} name="role" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE">Mitarbeiter</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="ADMIN">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>

              {err && <p className="text-sm text-destructive">{err}</p>}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Anmelden…" : "Anmelden"}
              </Button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground">
              Neue Konten werden über Einladungen erstellt. Bitte kontaktieren Sie die Geschäftsleitung.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
