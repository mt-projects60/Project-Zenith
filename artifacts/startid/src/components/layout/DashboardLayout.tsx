import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, getInitials } from "@/contexts/AuthContext";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  roleLabel: string;
  roleColor: string;
}

export function DashboardLayout({
  children,
  navItems,
  title,
  roleLabel,
  roleColor,
}: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const initials = user ? getInitials(user.name) : "?";
  const logoUrl = user?.profile?.logoUrl as string | undefined;

  useEffect(() => {
    if (logoUrl) {
      const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "icon";
      link.href = logoUrl;
      document.head.appendChild(link);
    }
  }, [logoUrl]);

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r z-40 flex flex-col transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center gap-3 px-5 border-b shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
            <span className="font-bold text-lg tracking-tight">Project Zenith</span>
          </Link>
        </div>

        <div className="px-5 py-4 border-b shrink-0">
          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", roleColor)}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {roleLabel}
          </div>
          {user && (
            <p className="text-xs text-muted-foreground mt-2 truncate font-medium">{user.name}</p>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={cn("shrink-0 w-4 h-4", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                      isActive ? "bg-background/20 text-background" : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t shrink-0 space-y-1">
          <Link href="/">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-muted">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              Back to site
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-20 flex items-center px-4 lg:px-8 gap-4 shrink-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="font-semibold text-base tracking-tight">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            {user && (
              <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-36">{user.email}</span>
            )}
            {logoUrl ? (
              <img src={logoUrl} alt={user?.name || "avatar"} className="w-8 h-8 rounded-full object-cover border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-xs font-bold text-background">
                {initials}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
