import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { ProfileCompletion } from "@/components/ProfileCompletion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Heart, Calendar, Compass, Check, User, Linkedin, Twitter, Globe, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const navItems: NavItem[] = [
  { label: "Home", href: "/community/dashboard", icon: <LayoutDashboard /> },
  { label: "My Profile", href: "/community/profile", icon: <User /> },
  { label: "Following", href: "/community/following", icon: <Heart /> },
  { label: "Pitch Events", href: "/community/events", icon: <Calendar /> },
  { label: "Explore", href: "/community/explore", icon: <Compass /> },
];

const followedStartups = [
  { name: "NovaPay", industry: "Fintech", stage: "Seed", update: "Just closed $1.85M of their $3M round — 62% funded!", time: "2h ago", color: "bg-blue-600" },
  { name: "HelixAI", industry: "HealthTech", stage: "Series A", update: "New partnership announced with Mayo Clinic for clinical trial AI.", time: "1d ago", color: "bg-emerald-600" },
  { name: "DataVault", industry: "Web3", stage: "Series A", update: "Product update: Self-custody data dashboard is now live.", time: "2d ago", color: "bg-purple-600" },
  { name: "GreenLoop", industry: "CleanTech", stage: "Pre-Seed", update: "Onboarded first 10 enterprise customers in pilot.", time: "3d ago", color: "bg-green-500" },
];

const events = [
  { id: 1, name: "Mumbai Startup Pitch Night", date: "March 20, 2026", location: "Mumbai, India (Hybrid)", type: "Demo Day", slots: 12 },
  { id: 2, name: "Y Combinator Office Hours — India & SEA", date: "March 25, 2026", location: "Virtual", type: "Office Hours", slots: 4 },
  { id: 3, name: "Singapore Fintech Festival — Investor Summit", date: "April 2, 2026", location: "Singapore", type: "Summit", slots: 50 },
  { id: 4, name: "Project Zenith Demo Day — Q2 2026", date: "April 15, 2026", location: "Virtual", type: "Demo Day", slots: 200 },
  { id: 5, name: "HealthTech Pitch Competition", date: "April 22, 2026", location: "Bengaluru, India (Hybrid)", type: "Competition", slots: 30 },
];

const recommended = [
  { name: "QuantumRisk", industry: "InsurTech", stage: "Series B", pitch: "Quantum-computing risk modeling for insurers", color: "bg-violet-800" },
  { name: "MindBridge", industry: "HealthTech", stage: "Seed", pitch: "Mental health platform for enterprise teams", color: "bg-indigo-500" },
  { name: "LegalMind", industry: "LegalTech", stage: "Pre-Seed", pitch: "AI-powered contract intelligence", color: "bg-stone-700" },
  { name: "TalentGraph", industry: "HRTech", stage: "Seed", pitch: "Skills-based hiring intelligence", color: "bg-cyan-600" },
  { name: "CarbonCore", industry: "CleanTech", stage: "Seed", pitch: "Real-time carbon accounting for supply chains", color: "bg-teal-700" },
  { name: "FreightFlow", industry: "Logistics", stage: "Seed", pitch: "Real-time freight pricing engine", color: "bg-sky-600" },
];

function FeedTab() {
  return (
    <div className="space-y-4">
      {followedStartups.map((s, i) => (
        <div key={i} className="bg-card border rounded-xl p-5 flex gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0", s.color)}>{s.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-semibold text-sm">{s.name}</p>
              <Badge variant="secondary" className="text-[10px]">{s.industry}</Badge>
              <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
              <span className="text-[10px] text-muted-foreground ml-auto">{s.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{s.update}</p>
            <div className="flex items-center gap-3 mt-3">
              <Link href={`/startups/${s.name.toLowerCase()}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground px-2">View profile →</Button>
              </Link>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground px-2">
                <Heart className="w-3.5 h-3.5 mr-1" /> Like
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventsTab() {
  const [rsvpd, setRsvpd] = useState<number[]>([2]);
  const toggle = (id: number) => setRsvpd(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const typeColor: Record<string, string> = {
    "Demo Day": "bg-blue-50 text-blue-700", "Office Hours": "bg-violet-50 text-violet-700",
    "Summit": "bg-amber-50 text-amber-700", "Competition": "bg-rose-50 text-rose-600",
  };
  return (
    <div className="space-y-4">
      {events.map(ev => (
        <div key={ev.id} className="bg-card border rounded-xl p-5 flex items-start gap-5">
          <div className="shrink-0 w-14 text-center hidden sm:block">
            <div className="text-xs text-muted-foreground font-medium">{ev.date.split(" ")[0].toUpperCase()} {ev.date.split(" ")[1].replace(",", "")}</div>
            <div className="text-2xl font-bold mt-0.5">{ev.date.split(" ")[2].substring(0, 2)}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-semibold">{ev.name}</p>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", typeColor[ev.type] || "bg-muted text-muted-foreground")}>{ev.type}</span>
            </div>
            <p className="text-sm text-muted-foreground">{ev.location}</p>
            <p className="text-xs text-muted-foreground mt-1">{ev.slots} spots remaining</p>
          </div>
          <Button
            size="sm"
            variant={rsvpd.includes(ev.id) ? "default" : "outline"}
            className={cn("shrink-0 h-8 text-xs gap-1.5", rsvpd.includes(ev.id) && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600")}
            onClick={() => toggle(ev.id)}
          >
            {rsvpd.includes(ev.id) ? <><Check className="w-3.5 h-3.5" /> RSVP'd</> : "RSVP"}
          </Button>
        </div>
      ))}
    </div>
  );
}

function ExploreTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Recommended based on your interests in HealthTech and AI.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommended.map((s, i) => (
          <Link key={i} href={`/startups/${s.name.toLowerCase()}`}>
            <div className="bg-card border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm", s.color)}>{s.name[0]}</div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.name}</p>
                  <div className="flex gap-1.5 mt-0.5">
                    <Badge variant="secondary" className="text-[10px]">{s.industry}</Badge>
                    <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.pitch}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const p = user?.profile || {};

  const [form, setForm] = useState({
    displayName: p.displayName || user?.name || "",
    bio: p.bio || "",
    website: p.website || "",
    linkedinUrl: p.linkedinUrl || "",
    twitterUrl: p.twitterUrl || "",
    logoUrl: p.logoUrl || "",
  });

  const [visibility, setVisibility] = useState({
    bio: true,
    social: true,
    activity: true,
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleVis = (k: keyof typeof visibility) =>
    setVisibility(v => ({ ...v, [k]: !v[k] }));

  const handleSave = () => {
    updateProfile(form as any);
    toast({ title: "Profile saved", description: "Your changes have been saved successfully." });
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Basic Info */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Your Identity</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Display Name</Label>
            <Input value={form.displayName} onChange={set("displayName")} placeholder="How you appear to others" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Profile Photo / Logo URL</Label>
            <Input value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://example.com/your-photo.png" />
            {form.logoUrl && (
              <img src={form.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-cover border bg-muted mt-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <p className="text-xs text-muted-foreground">Shown on your profile and as your avatar across the platform.</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold">Bio</h3>
          <div className="flex items-center gap-2">
            {visibility.bio ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.bio} onCheckedChange={() => toggleVis("bio")} />
            <span className="text-xs text-muted-foreground">{visibility.bio ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6">
          <Textarea value={form.bio} onChange={set("bio")} rows={4} placeholder="Tell the community about yourself — what you're building, investing in, or excited about..." />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold">Social & Web Links</h3>
          <div className="flex items-center gap-2">
            {visibility.social ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.social} onCheckedChange={() => toggleVis("social")} />
            <span className="text-xs text-muted-foreground">{visibility.social ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Website</Label></div>
            <Input value={form.website} onChange={set("website")} placeholder="https://yourwebsite.com" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">LinkedIn URL</Label></div>
            <Input value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Twitter className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">X / Twitter URL</Label></div>
            <Input value={form.twitterUrl} onChange={set("twitterUrl")} placeholder="https://x.com/yourhandle" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="px-8" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

export default function CommunityDashboard() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => { if (!isLoading && !user) setLocation("/login"); }, [isLoading, user]);
  if (isLoading || !user) return null;
  if (!user.onboardingComplete) { setLocation("/onboarding"); return null; }

  const activeTab = location.startsWith("/community/profile") ? "profile"
    : location.startsWith("/community/following") ? "feed"
    : location.startsWith("/community/events") ? "events"
    : location.startsWith("/community/explore") ? "explore"
    : "feed";

  const TAB_URL: Record<string, string> = {
    feed: "/community/dashboard",
    profile: "/community/profile",
    events: "/community/events",
    explore: "/community/explore",
  };

  const firstName = user?.name?.split(" ")[0] || "Friend";
  const p = user?.profile || {};
  const communityCompletionItems = [
    { label: "Display name", done: !!p.displayName },
    { label: "Bio", done: !!p.bio },
    { label: "LinkedIn profile", done: !!p.linkedinUrl },
    { label: "Website or Twitter", done: !!(p.website || p.twitterUrl) },
  ];
  const communitySlug = user?.name ? user.name.toLowerCase().replace(/\s+/g, "-") : "";
  const communityProfileUrl = communitySlug ? `${window.location.origin}/community/${communitySlug}` : undefined;

  return (
    <DashboardLayout navItems={navItems} title="Community Hub" roleLabel="Enthusiast" roleColor="bg-orange-50 text-orange-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Welcome back, {firstName} 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Following 4 startups · 2 upcoming events</p>
      </div>
      <div className="mb-6">
        <ProfileCompletion items={communityCompletionItems} profileUrl={communityProfileUrl} role="community" />
      </div>
      <Tabs value={activeTab} onValueChange={(v) => setLocation(TAB_URL[v] || "/community/dashboard")} className="space-y-6">
        <TabsList className="bg-muted/50 border h-9">
          <TabsTrigger value="feed" className="text-xs">Following</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs">My Profile</TabsTrigger>
          <TabsTrigger value="events" className="text-xs">Pitch Events</TabsTrigger>
          <TabsTrigger value="explore" className="text-xs">Recommended</TabsTrigger>
        </TabsList>
        <TabsContent value="feed"><FeedTab /></TabsContent>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="events"><EventsTab /></TabsContent>
        <TabsContent value="explore"><ExploreTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
