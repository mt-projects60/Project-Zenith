import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Calendar, Globe, Heart, Star, Users, Compass, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const upcomingEvents = [
  { id: 1, name: "Mumbai Startup Pitch Night", date: "Mar 20", location: "Mumbai, India (Hybrid)", type: "Demo Day", typeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: 2, name: "Y Combinator Office Hours — India & SEA", date: "Mar 25", location: "Virtual", type: "Office Hours", typeColor: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: 3, name: "Singapore Fintech Festival — Investor Summit", date: "Apr 2", location: "Singapore", type: "Summit", typeColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: 4, name: "Project Zenith Demo Day — Q2 2026", date: "Apr 15", location: "Virtual", type: "Demo Day", typeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: 5, name: "HealthTech Pitch Competition", date: "Apr 22", location: "Bengaluru, India (Hybrid)", type: "Competition", typeColor: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: 6, name: "CleanTech Investor Roundtable", date: "May 5", location: "Virtual", type: "Roundtable", typeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const featuredStartups = [
  { name: "NovaPay", industry: "Fintech", stage: "Seed", pitch: "The Stripe for emerging markets", color: "bg-blue-600", upvotes: 247 },
  { name: "HelixAI", industry: "HealthTech", stage: "Series A", pitch: "AI copilot for clinical trials", color: "bg-emerald-600", upvotes: 312 },
  { name: "DataVault", industry: "Web3", stage: "Series A", pitch: "Self-sovereign data marketplace", color: "bg-purple-600", upvotes: 445 },
  { name: "QuantumRisk", industry: "InsurTech", stage: "Series B", pitch: "Quantum-computing risk modeling for insurers", color: "bg-violet-800", upvotes: 521 },
  { name: "SolarStack", industry: "CleanTech", stage: "Series A", pitch: "Community solar subscription management", color: "bg-amber-500", upvotes: 287 },
  { name: "MindBridge", industry: "HealthTech", stage: "Seed", pitch: "Mental health platform for enterprise teams", color: "bg-indigo-500", upvotes: 203 },
];

const perks = [
  { icon: <Heart className="w-5 h-5" />, title: "Follow Top Startups", body: "Get notified when your favorite startups hit milestones, close rounds, or announce partnerships." },
  { icon: <Calendar className="w-5 h-5" />, title: "Pitch Events & Demo Days", body: "Discover and RSVP to curated pitch events, investor summits, and demo days worldwide." },
  { icon: <Compass className="w-5 h-5" />, title: "Explore the Ecosystem", body: "Browse recommended startups across sectors you care about — Fintech, AI, CleanTech, and more." },
  { icon: <Star className="w-5 h-5" />, title: "Upvote Your Favourites", body: "Surface the startups you believe in. Your upvotes influence their visibility to investors." },
];

export default function Community() {
  const [rsvpd, setRsvpd] = useState<number[]>([]);
  const toggle = (id: number) => setRsvpd(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-4 border-b bg-gradient-to-b from-orange-50/60 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
            <Globe className="w-3.5 h-3.5" /> Community
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
            The startup ecosystem,<br />
            <span className="text-orange-500">in one place.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Follow top startups, attend pitch events, discover the next generation of founders — without the noise of a generic social network.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 gap-2 bg-orange-500 hover:bg-orange-600">
                Join the community <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="rounded-full px-10 bg-background">
                Explore startups
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground flex-wrap">
            {["Free forever", "No deal tools", "Pure exploration"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">What you get</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Built for curious minds</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">No investing tools. No capital features. Just the ecosystem, open to you.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {perks.map(p => (
              <div key={p.title} className="bg-card border rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">{p.icon}</div>
                <div>
                  <h3 className="font-bold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-20 px-4 border-b bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Events</p>
              <h2 className="text-3xl font-extrabold tracking-tight">Upcoming pitch events</h2>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="gap-1.5 text-sm">
                View calendar <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map(ev => (
              <div key={ev.id} className="bg-background border rounded-xl p-5 flex items-center gap-5">
                <div className="shrink-0 text-center w-12">
                  <p className="text-[10px] font-semibold text-muted-foreground">{ev.date.split(" ")[0].toUpperCase()}</p>
                  <p className="text-2xl font-extrabold leading-none">{ev.date.split(" ")[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-semibold">{ev.name}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", ev.typeColor)}>{ev.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ev.location}</p>
                </div>
                <Button
                  size="sm"
                  variant={rsvpd.includes(ev.id) ? "default" : "outline"}
                  className={cn("shrink-0 h-8 text-xs gap-1.5", rsvpd.includes(ev.id) && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600")}
                  onClick={() => toggle(ev.id)}
                >
                  {rsvpd.includes(ev.id) ? <><Check className="w-3.5 h-3.5" />RSVP'd</> : "RSVP"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured startups */}
      <section className="py-20 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Trending</p>
              <h2 className="text-3xl font-extrabold tracking-tight">Startups to watch</h2>
            </div>
            <Link href="/discover">
              <Button variant="outline" className="gap-1.5 text-sm">
                Browse all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredStartups.map(s => (
              <Link key={s.name} href={`/startups/${s.name.toLowerCase()}`}>
                <div className="bg-card border rounded-2xl p-5 hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm", s.color)}>
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-orange-500 transition-colors">{s.name}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge variant="secondary" className="text-[10px]">{s.industry}</Badge>
                        <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.pitch}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {s.upvotes} upvotes</span>
                    <span className="group-hover:text-orange-500 transition-colors">View profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Be part of the ecosystem</h2>
          <p className="text-muted-foreground">Join thousands of startup enthusiasts following the next wave of founders.</p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-12 gap-2 bg-orange-500 hover:bg-orange-600">
              Join for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
