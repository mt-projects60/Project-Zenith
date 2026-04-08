import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, TrendingUp, Search, KanbanSquare, Shield, Filter, Bell, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: <Search className="w-5 h-5" />, title: "Advanced Discovery", body: "Filter startups by stage, industry, revenue range, % funded, instrument type, and geography. Surface exactly what you want." },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Verified Traction Data", body: "Every metric is standardized. Compare MRR, growth rates, CAC, and burn across hundreds of startups instantly." },
  { icon: <KanbanSquare className="w-5 h-5" />, title: "Deal Flow Kanban", body: "Manage your pipeline from Bookmarked → In Conversation → Invested. Never lose track of a deal again." },
  { icon: <Shield className="w-5 h-5" />, title: "Gated Data Room Access", body: "Request access to financials, cap tables, and legal docs. Founders approve access — clean, structured, no email chains." },
  { icon: <Bell className="w-5 h-5" />, title: "Alerts & Notifications", body: "Get notified when startups in your focus area publish new profiles, close funding milestones, or unlock data rooms." },
  { icon: <Filter className="w-5 h-5" />, title: "Commitment Ledger", body: "Track all your capital commitments across deals in one ledger. Status, round type, date, and amounts — all in one view." },
];

const stats = [
  { value: "2,400+", label: "Startups on platform" },
  { value: "$180M+", label: "Capital raised" },
  { value: "48h", label: "Avg. first response" },
  { value: "62", label: "Countries" },
];

const dealTypes = [
  { stage: "Pre-Seed", range: "$250K – $1M", instrument: "SAFE", color: "bg-slate-50 border-slate-200 text-slate-700" },
  { stage: "Seed", range: "$1M – $5M", instrument: "SAFE / Equity", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { stage: "Series A", range: "$5M – $20M", instrument: "Equity", color: "bg-violet-50 border-violet-200 text-violet-700" },
  { stage: "Series B+", range: "$20M+", instrument: "Equity / Debt", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
];

export default function ForInvestors() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-4 border-b bg-gradient-to-b from-emerald-50/60 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> For Investors
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            The best deal flow.<br />
            <span className="text-emerald-600">Structured. Verified. Actionable.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop scrolling LinkedIn. Access 2,400+ verified startups, filter by your exact investment thesis, and manage your pipeline in one place.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 gap-2 bg-emerald-600 hover:bg-emerald-700">
                Access Deal Flow <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="rounded-full px-10 bg-background">
                Browse startups
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map(s => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-700">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Built for investors</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Your deal flow command center</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="bg-card border rounded-2xl p-6 space-y-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">{f.icon}</div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal types */}
      <section className="py-20 px-4 border-b bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">What's available</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Every stage. Every instrument.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dealTypes.map(d => (
              <div key={d.stage} className={cn("border-2 rounded-2xl p-5 space-y-2", d.color)}>
                <p className="font-bold text-sm">{d.stage}</p>
                <p className="text-lg font-extrabold">{d.range}</p>
                <p className="text-xs opacity-70 font-medium">{d.instrument}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl font-extrabold tracking-tight">From signup to signed term sheet</h2>
          </div>
          <div className="space-y-4">
            {[
              ["01", "Set your thesis", "Choose your preferred stages, sectors, check size range, and instruments."],
              ["02", "Browse curated deal flow", "Your feed surfaces startups that match your thesis. Filter and sort as needed."],
              ["03", "Express interest & request data room", "Bookmark deals, express interest, and request financial documents directly."],
              ["04", "Manage your pipeline", "Track every deal on a Kanban board from first contact to commitment."],
            ].map(([n, t, b]) => (
              <div key={n} className="bg-card border rounded-xl p-5 flex gap-5 items-start">
                <span className="text-2xl font-extrabold text-muted-foreground/30 font-mono shrink-0 leading-tight">{n}</span>
                <div>
                  <p className="font-bold mb-1">{t}</p>
                  <p className="text-sm text-muted-foreground">{b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Start finding your next portfolio company</h2>
          <p className="text-muted-foreground">Investor accounts are free. No sourcing fees, no hidden costs.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-12 gap-2 bg-emerald-600 hover:bg-emerald-700">
                Create investor account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="rounded-full px-10 bg-background">Browse startups</Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground flex-wrap">
            {["No sourcing fees", "Verified founder data", "Direct data room access"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
