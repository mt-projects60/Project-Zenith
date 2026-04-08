import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Briefcase, Eye, Inbox, Star, Scale, Code, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { icon: <Scale className="w-5 h-5" />, label: "Legal", desc: "Incorporation, term sheets, compliance" },
  { icon: <Code className="w-5 h-5" />, label: "Technology", desc: "Engineering, CTO-as-a-service, product" },
  { icon: <Users className="w-5 h-5" />, label: "Hiring", desc: "Recruitment, HR, team building" },
  { icon: <DollarSign className="w-5 h-5" />, label: "Finance", desc: "CFO advisory, modeling, accounting" },
  { icon: <Star className="w-5 h-5" />, label: "Marketing", desc: "Brand, growth, PR, content" },
  { icon: <Briefcase className="w-5 h-5" />, label: "Operations", desc: "Strategy, process, scaling" },
];

const features = [
  { icon: <Eye className="w-5 h-5" />, title: "Profile Discovery", body: "Funded startups actively search Project Zenith for trusted service providers. Your profile is your inbound funnel." },
  { icon: <Inbox className="w-5 h-5" />, title: "Inbound Lead Inbox", body: "Receive and manage service requests from vetted startups directly in your dashboard. No cold outreach needed." },
  { icon: <Star className="w-5 h-5" />, title: "Category Listing", body: "Get listed under your service category — Legal, Tech, Hiring, Finance, Marketing, or Operations." },
  { icon: <Briefcase className="w-5 h-5" />, title: "Lead Status Tracking", body: "Track every inbound request from New → Replied → Closed. Know exactly where each relationship stands." },
];

const socialProof = [
  { name: "Okafor & Associates", category: "Legal", stat: "34 startups served" },
  { name: "Techbridge Studio", category: "Technology", stat: "$2.4M in contracts" },
  { name: "TalentFirst HQ", category: "Hiring", stat: "120+ hires placed" },
];

export default function ForProviders() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-4 border-b bg-gradient-to-b from-violet-50/60 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
            <Briefcase className="w-3.5 h-3.5" /> For Service Providers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            Funded startups need you.<br />
            <span className="text-violet-600">Find them here.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            List your firm on Project Zenith and receive inbound leads from startups who need legal, tech, hiring, finance, and operations support right now.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 gap-2 bg-violet-600 hover:bg-violet-700">
                List your firm <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground flex-wrap">
            {["Free to list", "No commission", "Inbound leads only"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 border-b bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Service categories</p>
            <h2 className="text-3xl font-extrabold tracking-tight">What kind of firm are you?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => (
              <div key={c.label} className="bg-background border rounded-2xl p-5 flex gap-4 items-start hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">{c.icon}</div>
                <div>
                  <p className="font-bold">{c.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Provider tools</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Your startup B2B engine</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-card border rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-4 border-b bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Trusted providers</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Firms already on Project Zenith</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {socialProof.map(p => (
              <div key={p.name} className="bg-background border rounded-2xl p-6 space-y-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-lg mx-auto">
                  {p.name[0]}
                </div>
                <p className="font-bold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
                <p className="text-sm font-semibold text-violet-700">{p.stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to grow your startup book?</h2>
          <p className="text-muted-foreground">List your firm for free. Receive inbound leads from funded, ambitious startups.</p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-12 gap-2 bg-violet-600 hover:bg-violet-700">
              List your firm for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
