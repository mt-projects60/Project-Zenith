import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, Globe, Zap, Shield, TrendingUp, Award } from "lucide-react";

const team = [
  { name: "Arjun Mehta", role: "CEO & Co-Founder", bio: "Former VP at Goldman Sachs India. 15 years in emerging markets capital and investment banking.", initials: "AM", color: "bg-blue-600" },
  { name: "Priya Nair", role: "CTO & Co-Founder", bio: "Ex-Razorpay principal engineer. Built payment infrastructure across 14 countries.", initials: "PN", color: "bg-emerald-600" },
  { name: "Rohan Kapoor", role: "Head of Investor Relations", bio: "Previously led LP relations at Sequoia India. Deep network across global venture and family offices.", initials: "RK", color: "bg-violet-600" },
  { name: "Priya Menon", role: "Head of Product", bio: "Built B2B SaaS at Notion and Linear. Obsessed with information density and user clarity.", initials: "PM", color: "bg-orange-600" },
  { name: "Vikram Rao", role: "Head of Growth", bio: "Scaled three fintech startups from zero to Series A across India, SEA, and the Middle East.", initials: "VR", color: "bg-rose-600" },
  { name: "Anika Singh", role: "General Counsel", bio: "International M&A and venture finance lawyer. Former partner at AZB & Partners, Mumbai.", initials: "AS", color: "bg-cyan-700" },
];

const values = [
  { icon: <Shield className="w-5 h-5" />, title: "Trust by design", desc: "Every piece of information on Project Zenith is structured, verifiable, and auditable. We treat capital infrastructure as seriously as a term sheet." },
  { icon: <Globe className="w-5 h-5" />, title: "Built for global founders", desc: "Capital markets have been gate-kept by geography. We believe a brilliant founder in Mumbai, Jakarta, or São Paulo deserves the same discovery surface as one in San Francisco." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Traction over hype", desc: "We reward founders who show real numbers. Our platform surfaces startups by verified metrics — not logos or pedigree." },
  { icon: <Zap className="w-5 h-5" />, title: "Speed and precision", desc: "Every investor decision on Project Zenith happens in context. The right data, at the right time, for the right capital allocation." },
];

const stats = [
  { value: "$1.2B+", label: "Capital facilitated" },
  { value: "3,400+", label: "Startups on platform" },
  { value: "890+", label: "Verified investors" },
  { value: "42", label: "Countries represented" },
];

export default function About() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Hero */}
        <div className="pt-20 pb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted mb-6">
            <Award className="w-3.5 h-3.5" /> Founded 2024 · Mumbai & Singapore
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Replacing pitch decks with <span className="underline decoration-wavy decoration-blue-400">permanent capital identity</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Project Zenith is the institutional infrastructure layer for startup capital discovery. We give every serious startup a structured, investor-grade profile — and give every serious investor a real-time deal flow engine.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {stats.map(s => (
            <div key={s.label} className="text-center bg-card border rounded-2xl p-6">
              <p className="text-3xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Our Mission</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-5">Capital should flow to the best companies, not the best-connected</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every year, billions in venture capital misses the world's best startups because they lack the right network, the right geography, or the right introduction. We think that's a solvable problem.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Project Zenith creates a permanent, structured, investor-grade record for every startup — and makes that record discoverable to every qualified investor on the planet. No deck required.
            </p>
          </div>
          <div className="space-y-4">
            {values.map(v => (
              <div key={v.title} className="flex gap-4 bg-card border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  {v.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">{v.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">The Team</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Built by operators, investors, and builders</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map(m => (
              <div key={m.name} className="bg-card border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${m.color}`}>
                    {m.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-foreground text-background rounded-3xl p-16 mb-24">
          <Users className="w-10 h-10 mx-auto mb-6 opacity-70" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Join 3,400+ startups already on Project Zenith</h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">Create your structured startup profile in under 10 minutes. Investors are already looking.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8">Get started free</Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="px-8 border-background/30 text-background hover:bg-background/10">Browse startups</Button>
            </Link>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
