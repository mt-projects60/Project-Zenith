import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, BadgeCheck, Linkedin, Globe, Copy, Check, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CommunityProfileData {
  slug: string;
  name: string;
  background: string;
  bio: string;
  location: string;
  linkedin?: string;
  website?: string;
  interests: string[];
  verified: boolean;
  avatarColor: string;
}

const MOCK_COMMUNITY: Record<string, CommunityProfileData> = {
  "alex": {
    slug: "alex",
    name: "Chioma Eze",
    background: "Tech Community",
    bio: "Startup ecosystem builder based in Bangalore. Co-organiser of Bengaluru Startup Week. Passionate about empowering global founders and connecting the dots between capital and talent.",
    location: "Bangalore, India",
    linkedin: "https://linkedin.com/in/chioma-eze",
    interests: ["Fintech", "EdTech", "Community Building", "Venture Capital", "Climate Tech"],
    verified: false,
    avatarColor: "bg-orange-500",
  },
};

function setOgMeta(name: string, content: string, prop = false) {
  const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(sel) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

export default function CommunityProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const profile = MOCK_COMMUNITY[slug || ""];

  useEffect(() => { const t = setTimeout(() => setLoading(false), 300); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!profile) return;
    const title = `${profile.name} — ${profile.background} | Project Zenith`;
    const desc = `${profile.name} is part of the Project Zenith community. ${profile.bio.slice(0, 120)}`;
    document.title = title;
    setOgMeta("description", desc);
    setOgMeta("og:title", title, true);
    setOgMeta("og:description", desc, true);
    setOgMeta("og:url", `${window.location.origin}/community/${profile.slug}`, true);
    setOgMeta("og:type", "profile", true);
    setOgMeta("twitter:card", "summary_large_image");
    setOgMeta("twitter:title", title);
    setOgMeta("twitter:description", desc);
    return () => { document.title = "Project Zenith"; };
  }, [profile]);

  const shareUrl = `${window.location.origin}/community/${slug}`;
  const handleCopy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return <MainLayout><div className="container mx-auto px-4 py-12 max-w-3xl space-y-6"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-40 rounded-2xl" /></div></MainLayout>;

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Community profile not found</h1>
          <p className="text-muted-foreground">This profile doesn't exist or hasn't been made public yet.</p>
          <Button asChild variant="outline" className="rounded-xl mt-2"><a href="/">Go home</a></Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Hero */}
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
              <p className="text-muted-foreground font-medium">{profile.background}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {profile.linkedin && <Button size="sm" variant="outline" asChild className="rounded-xl gap-1.5"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4" /> LinkedIn</a></Button>}
              {profile.website && <Button size="sm" variant="outline" asChild className="rounded-xl gap-1.5"><a href={profile.website} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4" /> Website</a></Button>}
            </div>
          </div>
          {profile.bio && <p className="mt-5 text-muted-foreground leading-relaxed">{profile.bio}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2 space-y-5">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(i => <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-medium">{i}</span>)}
              </div>
            </div>
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
            </div>

            <div className="bg-primary rounded-2xl p-6 text-primary-foreground space-y-3">
              <Heart className="w-6 h-6" />
              <p className="font-semibold text-sm">Join the ecosystem</p>
              <p className="text-xs opacity-80">Sign up as a founder, investor, or community member on Project Zenith.</p>
              <Button size="sm" variant="secondary" asChild className="rounded-xl w-full"><a href="/signup">Sign up free →</a></Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
