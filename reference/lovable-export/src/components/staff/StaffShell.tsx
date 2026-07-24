import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { roleLabel } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/data/mock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const NAV = [
  { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/reservierungen", label: "Reservierungen", icon: CalendarClock },
  { to: "/staff/events", label: "Events", icon: CalendarDays },
  { to: "/staff/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/staff/sitzbereiche", label: "Sitzbereiche", icon: Armchair },
  { to: "/staff/oeffnungszeiten", label: "Öffnungszeiten", icon: Clock },
  { to: "/staff/team", label: "Team", icon: Users },
  { to: "/staff/settings", label: "Einstellungen", icon: Settings },
] as const;

export function StaffShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Frontend-only auth gate. Real enforcement lives in server code.
  useEffect(() => {
    if (!user) navigate({ to: "/staff/login", replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link to="/staff/dashboard" className="flex items-baseline gap-2">
            <span className="font-serif text-xl text-primary">Sternen</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Portal</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
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
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel(user.role)}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="font-serif text-xl text-primary">Sternen Portal</SheetTitle>
              </SheetHeader>
              <nav className="p-3">
                {NAV.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
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
                <Button variant="ghost" size="icon" aria-label="Benachrichtigungen" className="relative">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Benachrichtigungen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockNotifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                    <div className="flex w-full items-center gap-2">
                      <span className="text-sm font-medium">{n.title}</span>
                      {!n.read && <Badge variant="secondary" className="ml-auto text-[10px]">neu</Badge>}
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
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                  <span className="hidden text-sm sm:inline">{user.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.firstName} {user.lastName}
                  <div className="text-xs font-normal text-muted-foreground">{roleLabel(user.role)}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await signOut(); navigate({ to: "/staff/login" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Abmelden
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
