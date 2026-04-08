import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await forgotPassword(email.trim());
    setLoading(false);
    setSent(true);
  };

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
          <div>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>

            {!sent ? (
              <>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">Reset your password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your account email and we'll send you a secure link to set a new password.
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">Check your email</h1>
                <p className="text-muted-foreground text-sm">
                  If an account exists for <strong>{email}</strong>, we've sent a password reset link. Check your inbox (and spam folder).
                </p>
              </>
            )}
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label>Email address</Label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  autoComplete="email"
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl gap-2" disabled={loading || !email.trim()}>
                {loading ? "Sending…" : <><span>Send reset link</span><ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-emerald-800">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p>Reset link sent — the link expires in 1 hour.</p>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/login">Return to login</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
