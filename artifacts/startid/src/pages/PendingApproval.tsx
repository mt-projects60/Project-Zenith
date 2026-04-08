import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, CheckCircle, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, getRoleDashboard } from "@/contexts/AuthContext";

export default function PendingApproval() {
  const { user, logout } = useAuth();

  const steps = [
    { icon: <CheckCircle className="w-4 h-4" />, label: "Application submitted", done: true },
    { icon: <Clock className="w-4 h-4" />, label: "Admin review (24–48 hrs)", done: false },
    { icon: <ArrowRight className="w-4 h-4" />, label: "Profile goes live", done: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
          <span className="font-bold text-lg tracking-tight">Project Zenith</span>
        </Link>
        {user && (
          <button
            onClick={() => logout()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center space-y-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center mx-auto"
          >
            <Clock className="w-10 h-10 text-amber-500" />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {user?.name ? `Thanks, ${user.name.split(" ")[0]}!` : "Application submitted"}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Your Project Zenith profile has been submitted and is currently under review by our team.
              You will be notified within <strong>24–48 hours</strong> once your profile is approved.
            </p>
          </div>

          {/* Progress steps */}
          <div className="bg-muted/40 rounded-2xl p-6 space-y-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">What happens next</p>
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                  {s.icon}
                </div>
                <p className={`text-sm font-medium ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                {s.done && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/">Back to home</Link>
            </Button>
            {user && (
              <Button asChild className="rounded-xl gap-2">
                <Link href={getRoleDashboard(user.role)}>
                  <LayoutDashboard className="w-4 h-4" /> Go to my dashboard
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-xl">
              <a href="mailto:support@projectzenith.io">Contact support</a>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
