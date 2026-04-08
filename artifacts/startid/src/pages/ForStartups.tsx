import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Rocket, BarChart3, Users, FileText, Shield, TrendingUp, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Your Startup Profile",
    body: "A single, structured link that replaces your pitch deck. Investors see your full story — traction, team, round details — in one place.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Verified Traction Dashboard",
    body: "Display MRR, ARR, growth, CAC, users, and runway in a clean grid. Numbers do the convincing — not slides.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Gated Data Room",
    body: "Control who sees your financial model and cap table. Approve data room access only to investors you've vetted.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Real-time Round Tracker",
    body: "See committed capital, % funded, and investor pipeline at a glance. Close your round with confidence.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Investor Pipeline CRM",
    body: "Track every investor who's bookmarked, expressed interest, or requested access. Approve and deny in one click.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Public Discovery",
    body: "Get discovered by 1,800+ qualified investors actively browsing Project Zenith for their next deal.",
  },
];

const steps = [
  { num: "01", title: "Create your profile", body: "Add your company details, pitch, team bios, and funding terms in minutes." },
  { num: "02", title: "Upload your materials", body: "Link your pitch deck, pitch video, and add gated documents to your data room." },
  { num: "03", title: "Publish your Profile", body: "Go live. Share your link with investors. Let the platform surface you to new ones." },
  { num: "04", title: "Manage your round", body: "Approve data room requests, track interest, and close your round from your dashboard." },
];

const checklist = [
  "Custom profile URL (projectzenith.io/yourcompany)",
  "Traction metrics grid",
  "Gated data room with access control",
  "Investor pipeline CRM",
  "Real-time funding progress tracker",
  "Pitch deck & video links",
  "Team profiles with LinkedIn",
  "Pitch event scheduling",
];

export default function ForStartups() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-4 border-b bg-gradient-to-b from-blue-50/60 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
            <Rocket className="w-3.5 h-3.5" /> For Founders
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            Stop sending pitch decks.<br />
            <span className="text-blue-600">Send your Profile.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build a verified, structured startup profile that investors trust. Manage your entire fundraise from a single dashboard.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 gap-2 bg-blue-600 hover:bg-blue-700">
                Create your Profile <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/startups/novapay">
              <Button size="lg" variant="outline" className="rounded-full px-10 bg-background">
                See an example profile
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground flex-wrap">
            {["Free to create", "No credit card", "Live in 10 minutes"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Your fundraise, on autopilot</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-card border rounded-2xl p-6 space-y-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  {f.icon}
                </div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-b bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl font-extrabold tracking-tight">From signup to closed round</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="bg-background border rounded-2xl p-6 flex gap-5">
                <span className="text-3xl font-extrabold text-muted-foreground/30 font-mono shrink-0 leading-none">{s.num}</span>
                <div>
                  <h3 className="font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">What's included</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6">Everything in one profile</h2>
              <ul className="space-y-3">
                {checklist.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 border rounded-2xl p-8 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">NP</div>
              <div>
                <p className="font-bold text-lg">NovaPay</p>
                <p className="text-sm text-muted-foreground">The Stripe for emerging markets</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["Seed", "Stage"], ["$3M", "Target Raise"], ["62%", "Funded"], ["18 mo", "Runway"]].map(([v, l]) => (
                  <div key={l} className="bg-background border rounded-lg px-3 py-2.5">
                    <p className="font-bold text-sm">{v}</p>
                    <p className="text-[10px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
              <Link href="/startups/novapay">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  View live profile <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to replace your pitch deck?</h2>
          <p className="text-muted-foreground">It takes 10 minutes. Your profile works 24/7.</p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-12 gap-2 bg-blue-600 hover:bg-blue-700">
              Create your Profile for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
