import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Share, BadgeCheck, Globe, Linkedin, Building2, Briefcase, Copy, Check, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProviderProfileData {
  slug: string;
  name: string;
  companyName: string;
  title: string;
  bio: string;
  location: string;
  website?: string;
  linkedin?: string;
  services: string[];
  industries: string[];
  stages: string[];
  geographies: string[];
  notableClients: string[];
  verified: boolean;
  avatarColor: string;
}

const MOCK_PROVIDERS: Record<string, ProviderProfileData> = {
  "legalhub": {
    slug: "legalhub",
    name: "Emeka Okafor",
    companyName: "Okafor Law Group",
    title: "Managing Partner",
    bio: "Providing legal and compliance support to early-stage startups raising venture capital. 12+ years advising founders across India, UK, and UAE on term sheets, incorporation, and IP.",
    location: "Mumbai, India",
    website: "https://okaforlaw.com",
    linkedin: "https://linkedin.com/in/emeka-okafor",
    services: ["Legal & Compliance", "Fundraising", "Corporate Structuring", "IP Protection"],
    industries: ["Fintech", "Healthtech", "B2B SaaS"],
    stages: ["Pre-Seed", "Seed", "Series A"],
    geographies: ["India", "UK", "UAE"],
    notableClients: ["Razorpay", "Zepto", "OfBusiness"],
    verified: true,
    avatarColor: "bg-violet-600",
  },
};

function setOgMeta(name: string, content: string, prop = false) {
  const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(sel) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

export default function ProviderProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const profile = MOCK_PROVIDERS[slug || ""];

  useEffect(() => { const t = setTimeout(() => setLoading(false), 300); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!profile) return;
    const title = `${profile.companyName} — ${profile.services[0]} | Project Zenith`;
    const desc = `${profile.companyName} provides ${profile.services.slice(0, 3).join(", ")} for startups. Based in ${profile.location}.`;
    document.title = title;
    setOgMeta("description", desc);
    setOgMeta("og:title", title, true);
    setOgMeta("og:description", desc, true);
    setOgMeta("og:url", `${window.location.origin}/providers/${profile.slug}`, true);
    setOgMeta("og:type", "profile", true);
    setOgMeta("twitter:card", "summary_large_image");
    setOgMeta("twitter:title", title);
    setOgMeta("twitter:description", desc);
    return () => { document.title = "Project Zenith"; };
  }, [profile]);

  const shareUrl = `${window.location.origin}/providers/${slug}`;
  const handleCopy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return <MainLayout><div className="container mx-auto px-4 py-12 max-w-4xl space-y-6"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div></MainLayout>;

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Provider profile not found</h1>
          <p className="text-muted-foreground">This service provider hasn't created a public profile yet.</p>
          <Button asChild variant="outline" className="rounded-xl mt-2"><a href="/discover">Browse Providers</a></Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Hero */}
        <div className="bg-card border rounded-2xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0", profile.avatarColor)}>
              {profile.companyName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold tracking-tight">{profile.companyName}</h1>
                {profile.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-muted-foreground font-medium">{profile.title} — {profile.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Service Provider</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {profile.linkedin && <Button size="sm" variant="outline" asChild className="rounded-xl gap-1.5"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4" /> LinkedIn</a></Button>}
              {profile.website && <Button size="sm" variant="outline" asChild className="rounded-xl gap-1.5"><a href={profile.website} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4" /> Website</a></Button>}
            </div>
          </div>
          {profile.bio && <p className="mt-5 text-muted-foreground leading-relaxed">{profile.bio}</p>}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {profile.services.map(s => <span key={s} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>)}
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Industries & Stages</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Industries</p>
                  <div className="flex flex-wrap gap-1.5">{profile.industries.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Startup stages</p>
                  <div className="flex flex-wrap gap-1.5">{profile.stages.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
                </div>
              </div>
            </div>

            {profile.notableClients.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Notable Clients</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.notableClients.map(c => <span key={c} className="text-sm px-3 py-1.5 rounded-xl border bg-background font-medium">{c}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Share Profile</h2>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground truncate">{shareUrl}</div>
                <button onClick={handleCopy} className="shrink-0 p-2 rounded-lg border hover:bg-muted transition-colors">
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Share on LinkedIn, WhatsApp, or Slack. Link previews show company name and services.</p>
            </div>

            <div className="bg-card border rounded-2xl p-6 space-y-3">
              <p className="font-semibold text-sm">Geographies</p>
              <div className="flex flex-wrap gap-1.5">{profile.geographies.map(g => <Badge key={g} variant="outline">{g}</Badge>)}</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
