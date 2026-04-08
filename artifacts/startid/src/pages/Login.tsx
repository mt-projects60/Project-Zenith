import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Clock, XCircle } from "lucide-react";
import { useAuth, getRoleDashboard } from "@/contexts/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [statusInfo, setStatusInfo] = useState<"pending" | "rejected" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusInfo(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.error === "rejected") {
        setStatusInfo("rejected");
        setLoading(false);
        return;
      }
      if (result.error) {
        setError("Email or password is incorrect. Please try again.");
        setLoading(false);
        return;
      }
      // Login succeeded — check status from the returned user
      // We need to get user from context after login
      const token = localStorage.getItem("startid_jwt");
      if (token) {
        const r = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await r.json();
        const user = data.user;
        if (user.status === "rejected") {
          setStatusInfo("rejected");
          setLoading(false);
          return;
        }
        if (!user.onboardingComplete) {
          setLocation("/onboarding");
          return;
        }
        setLocation(getRoleDashboard(user.role));
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
          <span className="font-bold text-lg tracking-tight">Project Zenith</span>
        </Link>
        <div className="text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-foreground hover:underline">Sign up free</Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pt-16 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your Project Zenith account.</p>
          </div>

          {statusInfo === "pending" && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
              <Clock className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Profile under review</p>
                <p className="text-amber-700 mt-0.5">Your account is pending admin approval. You will receive an email once approved.</p>
              </div>
            </motion.div>
          )}

          {statusInfo === "rejected" && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Application not approved</p>
                <p className="text-red-700 mt-0.5">Your Project Zenith application was not approved. Please contact <span className="underline">support@projectzenith.io</span> for more information.</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); setStatusInfo(null); }}
                autoFocus
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <a href="mailto:support@projectzenith.io" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Reset password? Contact admin
                </a>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" size="lg" className="w-full rounded-xl gap-2" disabled={loading}>
              {loading ? "Signing in…" : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-foreground hover:underline">Create one free</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
