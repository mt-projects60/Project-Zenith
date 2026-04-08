import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Share, BadgeCheck, TrendingUp, Globe, Linkedin, Building2, DollarSign, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface InvestorProfile {
  slug: string;
  name: string;
  title: string;
  firm: string;
  firmType: string;
  bio: string;
  location: string;
  website?: string;
  linkedin?: string;
  industries: string[];
  stages: string[];
  checkMin: string;
  checkMax: string;
  portfolio: string[];
  verified: boolean;
  avatarColor: string;
}

const MOCK_INVESTORS: Record<string, InvestorProfile> = {
  "sarah-chen": {
    slug: "sarah-chen",
    name: "Sarah Chen",
    title: "Partner",
    firm: "Sequoia Capital",
    firmType: "Venture Capital",
    bio: "Backing India & Southeast Asia's most ambitious founders at Series A–B. 10+ years deploying growth-stage capital across Fintech, Climate, and B2B SaaS.",
    location: "San Francisco, USA",
    website: "https://sequoiacap.com",
    linkedin: "https://linkedin.com/in/sarah-chen",
    industries: ["Fintech", "Climate Tech", "B2B SaaS", "Healthtech"],
    stages: ["Series A", "Series B"],
    checkMin: "$500K",
    checkMax: "$5M",
    portfolio: ["Stripe", "Airbnb", "Notion", "Groq"],
    verified: true,
    avatarColor: "bg-emerald-600",
  },
};

function setOgMeta(name: string, content: string, prop = false) {
  const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(sel) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

export default function InvestorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const profile = MOCK_INVESTORS[slug || ""];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!profile) return;
    const title = `${profile.name} — ${profile.title} at ${profile.firm} | Project Zenith`;
    const desc = `${profile.name} is a ${profile.firmType} investor at ${profile.firm}. Investing in ${profile.industries.slice(0, 3).join(", ")}. Check size: ${profile.checkMin}–${profile.checkMax}.`;
    document.title = title;
    setOgMeta("description", desc);
    setOgMeta("og:title", title, true);
    setOgMeta("og:description", desc, true);
    setOgMeta("og:url", `${window.location.origin}/investors/${profile.slug}`, true);
    setOgMeta("og:type", "profile", true);
    setOgMeta("twitter:card", "summary_large_image");
    setOgMeta("twitter:title", title);
    setOgMeta("twitter:description", desc);
    return () => { document.title = "Project Zenith"; };
  }, [profile]);

  const shareUrl = `${window.location.origin}/investors/${slug}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Investor profile not found</h1>
          <p className="text-muted-foreground">This investor hasn't created a public profile yet, or the URL is incorrect.</p>
          <Button asChild variant="outline" className="rounded-xl mt-2">
            <a href="/discover">Browse Deal Flow</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Hero card */}
        <div className="bg-card border rounded-2xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0", profile.avatarColor)}>
              {profile.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold tracking-tight">{profile.name}</h1>
                {profile.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-muted-foreground font-medium">{profile.title} · {profile.firm}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {profile.firmType}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {profile.linkedin && (
                <Button size="sm" variant="outline" asChild className="rounded-xl gap-1.5">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4" /> LinkedIn</a>
                </Button>
              )}
              {profile.website && (
                <Button size="sm" variant="outline" asChild className="rounded-xl gap-1.5">
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4" /> Firm</a>
                </Button>
              )}
            </div>
          </div>
          {profile.bio && <p className="mt-5 text-muted-foreground leading-relaxed">{profile.bio}</p>}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: investment thesis */}
          <div className="lg:col-span-2 space-y-5">
            {/* Check size */}
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Investment Thesis</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Typical check size</p>
                  <p className="text-lg font-bold">{profile.checkMin} – {profile.checkMax}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Preferred stages</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile.stages.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Industries */}
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Industries of Interest</h2>
              <div className="flex flex-wrap gap-2">
                {profile.industries.map(i => (
                  <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{i}</span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            {profile.portfolio.length > 0 && (
              <div className="bg-card border rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Portfolio Companies</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.portfolio.map(c => (
                    <span key={c} className="text-sm px-3 py-1.5 rounded-xl border bg-background font-medium">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: share + connect */}
          <div className="space-y-5">
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Share Profile</h2>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-xs font-mono text-muted-foreground truncate">
                  {shareUrl}
                </div>
                <button onClick={handleCopy} className="shrink-0 p-2 rounded-lg border hover:bg-muted transition-colors">
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Share on LinkedIn, WhatsApp, or email. Link previews show profile name and bio.</p>
            </div>

            <div className="bg-primary rounded-2xl p-6 text-primary-foreground space-y-3">
              <TrendingUp className="w-6 h-6" />
              <p className="font-semibold">Looking to pitch?</p>
              <p className="text-sm opacity-80">Create a startup profile on Project Zenith to get in front of verified investors.</p>
              <Button size="sm" variant="secondary" asChild className="rounded-xl w-full">
                <a href="/signup">Create profile →</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
