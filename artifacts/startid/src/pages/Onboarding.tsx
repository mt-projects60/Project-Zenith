import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth, UserProfile, getRoleDashboard } from "@/contexts/AuthContext";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Step definitions per role ────────────────────────────────────

interface Field {
  key: keyof UserProfile;
  label: string;
  placeholder: string;
  type?: "text" | "textarea" | "url";
  required?: boolean;
  hint?: string;
}

interface Step {
  title: string;
  subtitle: string;
  fields: Field[];
}

const founderSteps: Step[] = [
  {
    title: "Tell us about your startup",
    subtitle: "This appears at the top of your public profile and helps investors find you.",
    fields: [
      { key: "company", label: "Startup name", placeholder: "NovaPay", required: true },
      { key: "industry", label: "Industry / Sector", placeholder: "Fintech", required: true },
      { key: "location", label: "Headquarters", placeholder: "Mumbai, India", required: true },
      { key: "founded", label: "Year founded", placeholder: "2023" },
      { key: "pitch", label: "One-line pitch", placeholder: "The Stripe for emerging markets", required: true, hint: "Keep it short — one sentence that a stranger would understand." },
      { key: "website", label: "Website URL", placeholder: "https://yourcompany.com", type: "url" },
    ],
  },
  {
    title: "What round are you raising?",
    subtitle: "Investors filter by stage and round size. Be specific.",
    fields: [
      { key: "stage", label: "Current stage", placeholder: "Pre-Seed · Seed · Series A · Series B", required: true },
      { key: "targetRaise", label: "Target raise (USD)", placeholder: "3000000", required: true, hint: "Enter the amount in full, e.g. 3000000 for $3M." },
      { key: "valuation", label: "Valuation / cap (USD)", placeholder: "18000000", hint: "Pre-money valuation or SAFE cap." },
      { key: "instrument", label: "Investment instrument", placeholder: "SAFE Note · Convertible Note · Equity" },
    ],
  },
  {
    title: "Share your story",
    subtitle: "Investors want to understand the problem you're solving and why now.",
    fields: [
      { key: "problem", label: "The problem", placeholder: "What pain point are you solving?", type: "textarea", required: true },
      { key: "solution", label: "Your solution", placeholder: "How does your product solve it?", type: "textarea", required: true },
      { key: "whyNow", label: "Why now?", placeholder: "Why is now the right moment for this to exist?", type: "textarea" },
    ],
  },
  {
    title: "Traction & pitch materials",
    subtitle: "Real numbers make investors stay. Share what you have — even early data is valuable.",
    fields: [
      { key: "mrr", label: "Monthly Recurring Revenue (USD)", placeholder: "42000", hint: "Leave blank if pre-revenue." },
      { key: "growth", label: "MoM growth rate (%)", placeholder: "18" },
      { key: "runway", label: "Runway (months)", placeholder: "18" },
      { key: "pitchDeckUrl", label: "Pitch deck URL", placeholder: "https://drive.google.com/...", type: "url", hint: "Google Drive, Notion, Docsend, etc." },
    ],
  },
];

const investorSteps: Step[] = [
  {
    title: "About your firm",
    subtitle: "Founders will see this when deciding whether to request a connection.",
    fields: [
      { key: "firm", label: "Firm / fund name", placeholder: "Sequoia Capital", required: true },
      { key: "website", label: "Website URL", placeholder: "https://yourfirm.com", type: "url" },
      { key: "bio", label: "About you", placeholder: "Brief background — firm history, your role, what you bring beyond capital.", type: "textarea" },
    ],
  },
  {
    title: "Your investment mandate",
    subtitle: "Help founders quickly see whether you're the right fit.",
    fields: [
      { key: "stageFocus", label: "Stage focus", placeholder: "Seed, Series A", required: true },
      { key: "checkSize", label: "Typical check size", placeholder: "$250K – $2M", required: true },
      { key: "industries", label: "Industries of interest", placeholder: "Fintech, HealthTech, CleanTech" },
      { key: "location", label: "Geography focus", placeholder: "India, Southeast Asia, Global" },
    ],
  },
  {
    title: "Your investment thesis",
    subtitle: "A clear thesis attracts better-fit founder inbound.",
    fields: [
      { key: "thesis", label: "Investment thesis", placeholder: "We back category-defining companies in emerging markets where incumbents are absent or slow to adapt...", type: "textarea", required: true },
      { key: "portfolio", label: "Notable portfolio companies", placeholder: "NovaPay, HelixAI, SolarStack (comma-separated)" },
    ],
  },
];

const providerSteps: Step[] = [
  {
    title: "About your company",
    subtitle: "Startups looking for help will see this first.",
    fields: [
      { key: "firmName", label: "Company name", placeholder: "Okafor & Associates", required: true },
      { key: "category", label: "Service category", placeholder: "Legal · Finance · Technology · Recruitment · Marketing", required: true },
      { key: "location", label: "Location", placeholder: "Mumbai, India" },
      { key: "website", label: "Website URL", placeholder: "https://yourcompany.com", type: "url" },
    ],
  },
  {
    title: "What you offer startups",
    subtitle: "Be specific about the services you provide and who benefits most.",
    fields: [
      { key: "serviceDesc", label: "One-line value proposition", placeholder: "What do you do for startups in one sentence?", required: true },
      { key: "bio", label: "Full description", placeholder: "Describe your services, areas of expertise, and what makes you the right choice for early-stage startups...", type: "textarea" },
      { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/yourcompany", type: "url" },
    ],
  },
];

const enthusiastSteps: Step[] = [
  {
    title: "Introduce yourself",
    subtitle: "Tell the community a little about you.",
    fields: [
      { key: "bio", label: "A little about you", placeholder: "I'm a startup ecosystem enthusiast passionate about fintech, deeptech, and impact investing globally...", type: "textarea" },
      { key: "location", label: "Where you're based", placeholder: "Mumbai, India" },
      { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/yourprofile", type: "url" },
      { key: "twitterUrl", label: "X / Twitter URL", placeholder: "https://x.com/yourhandle", type: "url" },
    ],
  },
];

const roleConfig = {
  startup: { steps: founderSteps, color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500", label: "Startup founder" },
  investor: { steps: investorSteps, color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500", label: "Investor" },
  provider: { steps: providerSteps, color: "text-violet-600", bg: "bg-violet-50", bar: "bg-violet-500", label: "Service provider" },
  enthusiast: { steps: enthusiastSteps, color: "text-orange-500", bg: "bg-orange-50", bar: "bg-orange-400", label: "Enthusiast" },
  admin: { steps: [], color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500", label: "Admin" },
};

// ─── Main component ───────────────────────────────────────────────

export default function Onboarding() {
  const { user, isLoading, updateProfile, completeOnboarding } = useAuth();
  const [, setLocation] = useLocation();
  const [stepIdx, setStepIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});
  const [done, setDone] = useState(false);

  if (isLoading) return null;

  if (!user) {
    setLocation("/login");
    return null;
  }

  const role = user.role as keyof typeof roleConfig;
  const config = roleConfig[role];
  const steps = config.steps;
  const totalSteps = steps.length;

  // Admin skips onboarding
  if (role === "admin" || totalSteps === 0) {
    completeOnboarding();
    setLocation("/pending-approval");
    return null;
  }

  const currentStep = steps[stepIdx];
  const pct = Math.round(((stepIdx) / totalSteps) * 100);

  const set = (k: keyof UserProfile, v: string) => {
    setData(d => ({ ...d, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const required = currentStep.fields.filter(f => f.required);
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    required.forEach(f => {
      if (!data[f.key]?.toString().trim()) {
        newErrors[f.key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    if (stepIdx < totalSteps - 1) {
      setDirection(1);
      setStepIdx(i => i + 1);
    } else {
      // Final step — save everything and go to pending-approval
      await updateProfile(data);
      await completeOnboarding();
      setDone(true);
      setTimeout(() => setLocation("/pending-approval"), 1800);
    }
  };

  const back = () => {
    if (stepIdx > 0) {
      setDirection(-1);
      setStepIdx(i => i - 1);
    }
  };

  const skip = () => {
    if (stepIdx < totalSteps - 1) {
      setDirection(1);
      setStepIdx(i => i + 1);
    } else {
      completeOnboarding();
      setLocation(getRoleDashboard(role));
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 max-w-sm mx-auto px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
            className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto", config.bg)}
          >
            <CheckCircle className={cn("w-10 h-10", config.color)} />
          </motion.div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Profile complete!</h1>
            <p className="text-muted-foreground">Taking you to your dashboard…</p>
          </div>
          <motion.div
            className={cn("h-1.5 rounded-full mx-auto", config.bar)}
            style={{ width: 0 }}
            animate={{ width: 240 }}
            transition={{ duration: 1.7, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
          <span className="font-bold text-lg tracking-tight">Project Zenith</span>
        </Link>
        <div className={cn("text-xs font-semibold px-3 py-1.5 rounded-full", config.bg, config.color)}>
          {config.label}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className={cn("h-full rounded-full", config.bar)}
          initial={{ width: `${pct}%` }}
          animate={{ width: `${Math.round(((stepIdx + 1) / totalSteps) * 100)}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step counter */}
      <div className="container mx-auto px-4 max-w-2xl pt-8 pb-2">
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn("h-1.5 rounded-full flex-1 transition-all duration-300",
                i < stepIdx ? config.bar :
                i === stepIdx ? config.bar + " opacity-60" :
                "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Step {stepIdx + 1} of {totalSteps}</p>
      </div>

      {/* Step content */}
      <main className="flex-1 container mx-auto px-4 max-w-2xl py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIdx}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">{currentStep.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{currentStep.subtitle}</p>
            </div>

            <div className="space-y-5">
              {currentStep.fields.map(field => (
                <div key={field.key as string} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  </div>
                  {field.type === "textarea" ? (
                    <Textarea
                      placeholder={field.placeholder}
                      value={(data[field.key] as string) || ""}
                      onChange={e => set(field.key, e.target.value)}
                      rows={4}
                      className={cn("resize-none", errors[field.key] && "border-red-400 focus-visible:ring-red-400")}
                    />
                  ) : (
                    <Input
                      type={field.type === "url" ? "url" : "text"}
                      placeholder={field.placeholder}
                      value={(data[field.key] as string) || ""}
                      onChange={e => set(field.key, e.target.value)}
                      className={errors[field.key] ? "border-red-400 focus-visible:ring-red-400" : ""}
                    />
                  )}
                  {field.hint && !errors[field.key] && (
                    <p className="text-xs text-muted-foreground">{field.hint}</p>
                  )}
                  {errors[field.key] && (
                    <p className="text-xs text-red-500">{errors[field.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <div className="border-t bg-background sticky bottom-0">
        <div className="container mx-auto px-4 max-w-2xl py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {stepIdx > 0 && (
              <Button variant="ghost" size="sm" onClick={back} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}
            <button
              onClick={skip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Skip this step
            </button>
          </div>
          <Button size="lg" onClick={next} className="gap-2 px-8">
            {stepIdx === totalSteps - 1 ? (
              <>Complete profile <CheckCircle className="w-4 h-4" /></>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
