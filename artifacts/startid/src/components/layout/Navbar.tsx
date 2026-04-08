import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, getInitials } from "@/contexts/AuthContext";

const ROLE_DASHBOARD: Record<string, string> = {
  startup:    "/founder/dashboard",
  investor:   "/investor/dashboard",
  provider:   "/provider/dashboard",
  enthusiast: "/community/dashboard",
  admin:      "/admin/dashboard",
};

const ROLE_LABEL: Record<string, string> = {
  startup:    "Founder",
  investor:   "Investor",
  provider:   "Service Provider",
  enthusiast: "Community",
  admin:      "Admin",
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Discover", href: "/discover" },
    { label: "For Startups", href: "/for-startups" },
    { label: "For Investors", href: "/for-investors" },
    { label: "For Providers", href: "/for-providers" },
    { label: "Community", href: "/community" },
  ];

  const dashboardHref = user ? (ROLE_DASHBOARD[user.role] || "/") : "/login";
  const initials = user ? getInitials(user.name) : "?";
  const logoUrl = user?.profile?.logoUrl as string | undefined;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold text-xl transition-transform group-hover:scale-105">
              Z
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              Project Zenith
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                    isActive
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border hover:bg-muted/60 transition-colors group"
              >
                {logoUrl ? (
                  <img src={logoUrl} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:block max-w-28 truncate">{user.name?.split(" ")[0]}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-card border rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center gap-3">
                        {logoUrl ? (
                          <img src={logoUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            {ROLE_LABEL[user.role] || user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nav options */}
                    <div className="p-2">
                      <Link href={dashboardHref} onClick={() => setUserMenuOpen(false)}>
                        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer text-sm font-medium">
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                          My Dashboard
                        </div>
                      </Link>
                      <Link href={`${dashboardHref.replace("/dashboard", "/profile")}`} onClick={() => setUserMenuOpen(false)}>
                        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Manage Profile
                        </div>
                      </Link>
                    </div>

                    <div className="p-2 border-t">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); window.location.href = "/"; }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors cursor-pointer text-sm font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="shadow-sm hover:shadow transition-all">Sign Up</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background px-4 py-4 space-y-4"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-foreground py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {logoUrl ? (
                      <img src={logoUrl} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">{initials}</div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">My Dashboard</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-red-600 hover:bg-red-50"
                    onClick={() => { logout(); setMobileMenuOpen(false); window.location.href = "/"; }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
