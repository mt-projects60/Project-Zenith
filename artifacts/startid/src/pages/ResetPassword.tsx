import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { resetPassword } = useAuth();

  // Extract token from URL
  const token = new URLSearchParams(window.location.search).get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!token) { setError("Invalid reset link. Please request a new one."); return; }
    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
    setTimeout(() => setLocation("/login"), 2500);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold">Invalid reset link</h2>
          <p className="text-muted-foreground text-sm">This link is missing or malformed.</p>
          <Button asChild variant="outline"><Link href="/forgot-password">Request a new link</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
          <span className="font-bold text-lg tracking-tight">Project Zenith</span>
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pt-16 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">

          {!done ? (
            <>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">Set a new password</h1>
                <p className="text-muted-foreground text-sm">Choose a strong password for your Project Zenith account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label>New password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      className="pr-10"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Confirm new password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your new password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(""); }}
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </motion.p>
                )}

                <Button type="submit" size="lg" className="w-full rounded-xl gap-2" disabled={loading}>
                  {loading ? "Saving…" : <><span>Save new password</span><ArrowRight className="w-4 h-4" /></>}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-extrabold mb-1">Password updated</h1>
                <p className="text-muted-foreground text-sm">Your password has been changed. Redirecting you to login…</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
