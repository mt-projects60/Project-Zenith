import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Calendar, MapPin, Users, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1, name: "Project Zenith Demo Day — Q2 2026", date: "April 15, 2026", location: "Virtual (Zoom)", type: "Demo Day",
    desc: "10 curated startups pitch to a panel of 30+ investors from India, Europe, and North America. Open to all verified investors.",
    slots: 200, registered: 87, featured: true,
    speakers: ["Arjun Mehta (Project Zenith)", "Sarah Chen (Sequoia)", "Fatima Hassan (a16z)"],
  },
  {
    id: 2, name: "Mumbai Startup Pitch Night", date: "March 20, 2026", location: "Mumbai, India (Hybrid)", type: "Demo Day",
    desc: "Live pitch event at the Trident, BKC. 8 founders pitch 5 minutes each to a live audience of 150 investors and operators.",
    slots: 150, registered: 138, featured: false,
    speakers: ["Rohan Kapoor (Project Zenith)", "Rahul Mehta (Peak XV Partners)"],
  },
  {
    id: 3, name: "Y Combinator Office Hours — India & SEA", date: "March 25, 2026", location: "Virtual", type: "Office Hours",
    desc: "1-on-1 and group office hours with YC alumni partners. Focused on pre-seed and seed-stage startups from India and Southeast Asia.",
    slots: 4, registered: 4, featured: false,
    speakers: ["YC Alumni Partners"],
  },
  {
    id: 4, name: "Singapore Fintech Festival — Investor Summit", date: "April 2, 2026", location: "Singapore", type: "Summit",
    desc: "Full-day summit bringing together Asia's leading investors, founders, and ecosystem builders. 20+ speakers, 8 panel discussions.",
    slots: 300, registered: 211, featured: false,
    speakers: ["Multiple confirmed speakers"],
  },
  {
    id: 5, name: "HealthTech Pitch Competition", date: "April 22, 2026", location: "Bengaluru, India (Hybrid)", type: "Competition",
    desc: "Pitch competition focused on HealthTech and MedTech startups globally. $50K prize pool. Applications open.",
    slots: 30, registered: 18, featured: false,
    speakers: ["Judges TBC"],
  },
  {
    id: 6, name: "India Fintech Founders Forum", date: "May 8, 2026", location: "Delhi NCR, India", type: "Summit",
    desc: "The premier Fintech investment forum connecting institutional investors with curated fintech founders. Two-day event.",
    slots: 120, registered: 44, featured: false,
    speakers: ["Confirmed investor panel"],
  },
  {
    id: 7, name: "Project Zenith CleanTech Showcase", date: "May 20, 2026", location: "Virtual", type: "Demo Day",
    desc: "Dedicated to climate and cleantech startups worldwide. 6 companies pitch to a panel of impact-focused investors.",
    slots: 500, registered: 102, featured: false,
    speakers: ["Project Zenith Team + Impact Investors"],
  },
];

const typeColor: Record<string, string> = {
  "Demo Day": "bg-blue-50 text-blue-700",
  "Office Hours": "bg-violet-50 text-violet-700",
  "Summit": "bg-amber-50 text-amber-700",
  "Competition": "bg-rose-50 text-rose-600",
};

export default function PitchEvents() {
  const [rsvpd, setRsvpd] = useState<number[]>([]);
  const [filter, setFilter] = useState("all");

  const toggle = (id: number) => setRsvpd(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const types = ["all", "Demo Day", "Office Hours", "Summit", "Competition"];
  const filtered = events.filter(e => filter === "all" || e.type === filter);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="pt-20 pb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted mb-6">
            <Calendar className="w-3.5 h-3.5" /> Q2 2026 Calendar
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Pitch events & investor forums</h1>
          <p className="text-lg text-muted-foreground">Demo days, office hours, and summits connecting founders with capital — across India, Asia, and globally.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn("text-xs font-semibold px-4 py-2 rounded-full border transition-all",
                filter === t ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/40"
              )}
            >
              {t === "all" ? "All events" : t}
            </button>
          ))}
        </div>

        {/* Featured event */}
        {filtered.filter(e => e.featured).map(ev => (
          <div key={ev.id} className="bg-foreground text-background rounded-2xl p-8 mb-6">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-background/20 text-background border-background/30 text-xs">Featured</Badge>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-background/20 text-background">{ev.type}</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-3">{ev.name}</h2>
                <p className="text-background/70 leading-relaxed mb-4">{ev.desc}</p>
                <div className="flex items-center gap-6 text-sm text-background/60 flex-wrap">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {ev.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {ev.location}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {ev.registered}/{ev.slots} registered</span>
                </div>
              </div>
              <Button
                variant={rsvpd.includes(ev.id) ? "secondary" : "secondary"}
                className={cn("shrink-0 gap-2", rsvpd.includes(ev.id) && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                onClick={() => toggle(ev.id)}
              >
                {rsvpd.includes(ev.id) ? <><Check className="w-4 h-4" /> RSVP'd</> : "RSVP free"}
              </Button>
            </div>
          </div>
        ))}

        {/* Event list */}
        <div className="space-y-4 mb-20">
          {filtered.filter(e => !e.featured).map(ev => {
            const pct = Math.round((ev.registered / ev.slots) * 100);
            const full = ev.registered >= ev.slots;
            return (
              <div key={ev.id} className="bg-card border rounded-2xl p-6">
                <div className="flex items-start gap-5 flex-wrap">
                  <div className="shrink-0 w-16 text-center hidden sm:block">
                    <div className="text-xs text-muted-foreground font-semibold uppercase">
                      {ev.date.split(" ")[0].slice(0,3)} {ev.date.split(",")[0].split(" ").slice(-1)}
                    </div>
                    <div className="text-3xl font-extrabold">
                      {ev.date.split(" ")[1].replace(",","")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold">{ev.name}</h3>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", typeColor[ev.type])}>{ev.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{ev.desc}</p>
                    <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ev.slots - ev.registered} spots left</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {full ? (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">Full</span>
                    ) : (
                      <Button
                        size="sm"
                        variant={rsvpd.includes(ev.id) ? "default" : "outline"}
                        className={cn("gap-1.5 h-8 text-xs", rsvpd.includes(ev.id) && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600")}
                        onClick={() => toggle(ev.id)}
                      >
                        {rsvpd.includes(ev.id) ? <><Check className="w-3.5 h-3.5" /> RSVP'd</> : "RSVP"}
                      </Button>
                    )}
                    <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="w-3 h-3" /> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Host your event CTA */}
        <div className="border rounded-2xl p-10 text-center mb-20">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Host an event on Project Zenith</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Accelerators, VCs, and ecosystem builders can list pitch events, demo days, and office hours for free on Project Zenith.</p>
          <Button size="lg">Apply to host</Button>
        </div>

      </div>
    </MainLayout>
  );
}
