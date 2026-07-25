import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { DemoLoginForm } from "@/components/staff/demo-login-form";
import { getDemoSession } from "@/lib/demo-session";
import { userRepository } from "@/repositories/user-repository";

export const metadata: Metadata = {
  title: "Mitarbeiter-Vorschau – Sternen Portal",
  description: "Design-/Demo-Vorschau des internen Reservations- und Betriebsportals.",
};

// Deliberately OUTSIDE app/(staff)/staff/(authenticated)/ so that once
// Auth.js's real redirect-if-unauthenticated logic replaces
// requireDemoSession(), this page can never end up behind its own gate.
export default async function StaffLoginPage() {
  const session = await getDemoSession();
  if (session) redirect("/staff/dashboard");

  const users = await userRepository.findMany();

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl">Sternen</span>
          <span className="text-xs uppercase tracking-widest text-primary-foreground/60">Portal</span>
        </Link>
        <div>
          <h2 className="font-serif text-4xl leading-tight">Reservationen. Team. Betrieb.</h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Ihr internes Dashboard für den täglichen Betrieb im Sternen Albisrieden.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">Sternen Albisrieden · Demo-Prototyp</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 sm:p-8">
            <h1 className="font-serif text-3xl text-primary">Mitarbeiterbereich</h1>
            <p className="mt-1 text-sm text-muted-foreground">Willkommen zurück.</p>
            <div className="mt-6">
              <DemoLoginForm users={users} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
