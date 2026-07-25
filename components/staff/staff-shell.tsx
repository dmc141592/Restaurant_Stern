"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  CalendarDays,
  BarChart3,
  Armchair,
  Clock,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { can, roleLabel, type Permission } from "@/lib/permissions";
import { DEMO_SESSION_COOKIE } from "@/lib/demo-session-shared";
import type { Notification, User } from "@/types";

const NAV: { href: string; label: string; icon: typeof LayoutDashboard; perm?: Permission }[] = [
  { href: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/reservierungen", label: "Reservierungen", icon: CalendarClock, perm: "reservation.view" },
  { href: "/staff/events", label: "Events", icon: CalendarDays, perm: "event.view" },
  { href: "/staff/analytics", label: "Analytics", icon: BarChart3, perm: "analytics.view" },
  { href: "/staff/sitzbereiche", label: "Sitzbereiche", icon: Armchair },
  { href: "/staff/oeffnungszeiten", label: "Öffnungszeiten", icon: Clock },
  { href: "/staff/team", label: "Team", icon: Users },
  { href: "/staff/settings", label: "Einstellungen", icon: Settings },
];

export function StaffShell({
  user,
  notifications,
  title,
  description,
  actions,
  children,
}: {
  user: User;
  notifications: Notification[];
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = NAV.filter((n) => !n.perm || can(user.role, n.perm));
  const unread = notifications.filter((n) => !n.read).length;

  function signOut() {
    // DEMO-ONLY: clears the demo-session cookie (see lib/demo-session.ts).
    // Nothing "secure" is happening here — replace entirely with Auth.js's
    // signOut() once real sessions exist.
    document.cookie = `${DEMO_SESSION_COOKIE}=; path=/; max-age=0`;
    router.push("/staff/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/staff/dashboard" className="flex items-baseline gap-2">
            <span className="font-serif text-xl text-primary">Sternen</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Portal</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-md bg-sidebar-accent px-3 py-2">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{roleLabel(user.role)} · Demo-Vorschau</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü öffnen">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="font-serif text-xl text-primary">Sternen Portal</SheetTitle>
              </SheetHeader>
              <nav className="p-3">
                {nav.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent/20"
                    >
                      <Icon className="h-4 w-4" />
                      {n.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl text-foreground">{title}</h1>
            {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Benachrichtigungen${unread > 0 ? ` (${unread} ungelesen)` : ""}`} className="relative">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Benachrichtigungen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 && (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">Keine Benachrichtigungen.</p>
                )}
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                    <div className="flex w-full items-center gap-2">
                      <span className="text-sm font-medium">{n.title}</span>
                      {!n.read && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          neu
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{n.body}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                  <span className="hidden text-sm sm:inline">{user.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.firstName} {user.lastName}
                  <div className="text-xs font-normal text-muted-foreground">{roleLabel(user.role)} · Demo-Vorschau</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Demo-Vorschau verlassen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="min-w-0 flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
