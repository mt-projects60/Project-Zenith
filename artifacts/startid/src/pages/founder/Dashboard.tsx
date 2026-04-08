import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, User, TrendingUp,
  Bell, CheckCircle, Clock, XCircle, Lock, MapPin,
  ImageIcon, FileText, Video, Linkedin, Twitter, Plus, Trash2, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES, CurrencyOption, convertAmount, parseUsdString } from "@/lib/currency";

const navItems: NavItem[] = [
  { label: "Overview", href: "/founder/dashboard", icon: <LayoutDashboard /> },
  { label: "Manage Profile", href: "/founder/profile", icon: <User /> },
  { label: "Investor Pipeline", href: "/founder/pipeline", icon: <TrendingUp /> },
];

const defaultPipeline = [
  { id: 1, name: "Sequoia Capital", firm: "Sequoia", amount: "$500K", status: "PENDING", type: "DATA_ROOM_REQUEST", date: "Mar 11, 2026" },
  { id: 2, name: "Demi Adeyemi", firm: "a16z", amount: "$250K", status: "PENDING", type: "EXPRESS_INTEREST", date: "Mar 10, 2026" },
  { id: 3, name: "Marcus Klein", firm: "Tiger Global", amount: "$1M", status: "APPROVED", type: "DATA_ROOM_REQUEST", date: "Mar 8, 2026" },
  { id: 4, name: "Sarah Okonkwo", firm: "Bessemer", amount: "$750K", status: "DENIED", type: "DATA_ROOM_REQUEST", date: "Mar 5, 2026" },
];

interface Founder {
  name: string;
  role: string;
  linkedinUrl: string;
  bio: string;
}

function calcProfileCompletion(p: ReturnType<typeof useAuth>["user"]): { pct: number; missing: string[] } {
  const profile = p?.profile || {};
  const checks: [boolean, string][] = [
    [!!profile.company, "Company name"],
    [!!profile.industry, "Industry"],
    [!!profile.pitch, "One-line pitch"],
    [!!profile.location, "Location"],
    [!!profile.stage, "Funding stage"],
    [!!profile.targetRaise, "Target raise"],
    [!!profile.problem, "Problem statement"],
    [!!profile.solution, "Solution description"],
    [!!profile.mrr || !!profile.arr, "Traction metrics"],
    [!!profile.website, "Website URL"],
  ];
  const done = checks.filter(([v]) => v).length;
  const missing = checks.filter(([v]) => !v).map(([, l]) => l);
  return { pct: Math.round((done / checks.length) * 100), missing };
}

function OverviewTab({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const p = user?.profile || {};
  const { pct, missing } = calcProfileCompletion(user);
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const targetUsd = parseUsdString(p.targetRaise || "");
  const targetDisplay = targetUsd > 0 ? convertAmount(targetUsd, currency) : "—";
  const hasProfile = pct > 0;

  return (
    <div className="space-y-8">
      {/* Currency selector + location bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {p.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{p.location}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">View amounts in:</span>
          <select
            value={currency.code}
            onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background font-semibold cursor-pointer"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Profile Completion</p>
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
              pct === 100 ? "bg-emerald-50 text-emerald-700" :
              pct >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
            )}>
              {pct === 100 ? "Complete" : pct >= 60 ? "Almost there" : "Incomplete"}
            </span>
          </div>
          <p className="text-3xl font-bold">{pct}%</p>
          <Progress value={pct} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {missing.length > 0 ? `Still needed: ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? ` +${missing.length - 2} more` : ""}` : "All sections filled in"}
          </p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Round Target</p>
          <p className="text-3xl font-bold">{targetDisplay}</p>
          {p.stage ? (
            <div className="flex gap-2">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{p.stage}</span>
              {p.instrument && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">{p.instrument}</span>}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Add your funding details →</p>
          )}
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Investor Activity</p>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">—</p>
          <p className="text-xs text-muted-foreground">Activity appears here once investors engage</p>
        </div>
      </div>

      {/* Complete profile CTA if incomplete */}
      {pct < 100 && (
        <div className="border border-dashed rounded-xl p-6 flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Your profile is {pct}% complete</p>
            <p className="text-sm text-muted-foreground mb-3">
              Complete profiles receive up to 4× more investor attention. Still missing: {missing.slice(0, 3).join(", ")}{missing.length > 3 ? ` and ${missing.length - 3} more` : ""}.
            </p>
            <Button size="sm" variant="outline" onClick={() => {}} className="text-xs">Go to Profile →</Button>
          </div>
        </div>
      )}

      {/* Traction snapshot */}
      {(p.mrr || p.arr || p.growth || p.runway) && (
        <div className="bg-card border rounded-xl p-5">
          <p className="text-sm font-semibold mb-4">Traction Snapshot</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "MRR", value: p.mrr ? `$${Number(p.mrr).toLocaleString()}` : "—" },
              { label: "ARR", value: p.arr ? `$${Number(p.arr).toLocaleString()}` : "—" },
              { label: "MoM Growth", value: p.growth ? `${p.growth}%` : "—" },
              { label: "Runway", value: p.runway ? `${p.runway} mo` : "—" },
            ].map(m => (
              <div key={m.label} className="text-center p-3 bg-muted/40 rounded-lg">
                <p className="text-lg font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty activity state */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold">Investor Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="font-medium mb-1">No investor activity yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Once investors bookmark, request your data room, or express interest, it will show here.
            {!hasProfile && " Complete your profile first to get discovered."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const p = user?.profile || {};

  const [form, setForm] = useState({
    company: p.company || "",
    industry: p.industry || "",
    location: p.location || "",
    founded: p.founded || "",
    pitch: p.pitch || "",
    website: p.website || "",
    logoUrl: p.logoUrl || "",
    linkedinUrl: p.linkedinUrl || "",
    twitterUrl: p.twitterUrl || "",
    stage: p.stage || "",
    targetRaise: p.targetRaise || "",
    valuation: p.valuation || "",
    instrument: p.instrument || "",
    pitchDeckUrl: p.pitchDeckUrl || "",
    pitchVideoUrl: p.pitchVideoUrl || "",
    problem: p.problem || "",
    solution: p.solution || "",
    whyNow: p.whyNow || "",
    mrr: p.mrr || "",
    arr: p.arr || "",
    growth: p.growth || "",
    runway: p.runway || "",
  });

  const [visibility, setVisibility] = useState({
    funding: true,
    metrics: true,
    pitchMaterials: true,
    story: true,
    team: true,
    social: true,
  });

  const [founders, setFounders] = useState<Founder[]>(
    (p as any).founders || []
  );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleVis = (k: keyof typeof visibility) =>
    setVisibility(v => ({ ...v, [k]: !v[k] }));

  const addFounder = () => setFounders(f => [...f, { name: "", role: "", linkedinUrl: "", bio: "" }]);
  const removeFounder = (i: number) => setFounders(f => f.filter((_, idx) => idx !== i));
  const updateFounder = (i: number, k: keyof Founder, v: string) =>
    setFounders(f => f.map((founder, idx) => idx === i ? { ...founder, [k]: v } : founder));

  const handleSave = () => {
    updateProfile({ ...form, founders } as any);
    toast({ title: "Profile saved", description: "All changes have been saved." });
  };

  return (
    <div className="max-w-2xl space-y-6">

      {/* Company Info */}
      <div className="bg-card border rounded-xl p-6 space-y-5">
        <h3 className="font-semibold text-base">Company Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Company Name</Label>
            <Input value={form.company} onChange={set("company")} placeholder="Your startup name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Industry</Label>
            <Input value={form.industry} onChange={set("industry")} placeholder="Fintech, HealthTech..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Location</Label>
            <Input value={form.location} onChange={set("location")} placeholder="City, Country" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Founded Year</Label>
            <Input value={form.founded} onChange={set("founded")} placeholder="2024" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium">One-line Pitch</Label>
            <Input value={form.pitch} onChange={set("pitch")} placeholder="What does your startup do in one sentence?" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium">Website URL</Label>
            <Input value={form.website} onChange={set("website")} placeholder="https://yourcompany.com" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-xs font-medium">Logo URL</Label>
            </div>
            <Input value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://yourcompany.com/logo.png" />
            {form.logoUrl && (
              <img src={form.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-contain border bg-muted mt-2"
                onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </div>
        </div>
      </div>

      {/* Funding Details */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Funding Details</h3>
          <div className="flex items-center gap-2">
            {visibility.funding ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.funding} onCheckedChange={() => toggleVis("funding")} />
            <span className="text-xs text-muted-foreground">{visibility.funding ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs font-medium">Stage</Label><Input value={form.stage} onChange={set("stage")} placeholder="Seed" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Target Raise ($)</Label><Input value={form.targetRaise} onChange={set("targetRaise")} placeholder="3000000" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Valuation ($)</Label><Input value={form.valuation} onChange={set("valuation")} placeholder="18000000" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Instrument</Label><Input value={form.instrument} onChange={set("instrument")} placeholder="SAFE Note" /></div>
        </div>
      </div>

      {/* Traction Metrics */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Traction & Metrics</h3>
          <div className="flex items-center gap-2">
            {visibility.metrics ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.metrics} onCheckedChange={() => toggleVis("metrics")} />
            <span className="text-xs text-muted-foreground">{visibility.metrics ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs font-medium">MRR ($)</Label><Input value={form.mrr} onChange={set("mrr")} placeholder="42000" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">ARR ($)</Label><Input value={form.arr} onChange={set("arr")} placeholder="504000" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Growth Rate (% MoM)</Label><Input value={form.growth} onChange={set("growth")} placeholder="18" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Runway (months)</Label><Input value={form.runway} onChange={set("runway")} placeholder="18" /></div>
        </div>
      </div>

      {/* Pitch Materials */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Pitch Materials</h3>
          <div className="flex items-center gap-2">
            {visibility.pitchMaterials ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.pitchMaterials} onCheckedChange={() => toggleVis("pitchMaterials")} />
            <span className="text-xs text-muted-foreground">{visibility.pitchMaterials ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Pitch Deck URL (Google Drive, Notion, etc.)</Label></div>
            <Input value={form.pitchDeckUrl} onChange={set("pitchDeckUrl")} placeholder="https://drive.google.com/..." />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Video className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Pitch Video URL (YouTube, Loom, etc.)</Label></div>
            <Input value={form.pitchVideoUrl} onChange={set("pitchVideoUrl")} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Story</h3>
          <div className="flex items-center gap-2">
            {visibility.story ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.story} onCheckedChange={() => toggleVis("story")} />
            <span className="text-xs text-muted-foreground">{visibility.story ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {([["problem", "Problem", "What problem are you solving?"], ["solution", "Solution", "How does your product solve it?"], ["whyNow", "Why Now", "Why is now the right time?"]] as const).map(([key, label, placeholder]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-medium">{label}</Label>
              <Textarea value={form[key]} onChange={set(key)} placeholder={placeholder} rows={3} />
            </div>
          ))}
        </div>
      </div>

      {/* Team / Founders */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Team & Founders</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {visibility.team ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
              <Switch checked={visibility.team} onCheckedChange={() => toggleVis("team")} />
              <span className="text-xs text-muted-foreground">{visibility.team ? "Visible" : "Hidden"}</span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {founders.length === 0 && (
            <p className="text-sm text-muted-foreground">No founders added yet. Add individual profiles for each co-founder with their LinkedIn.</p>
          )}
          {founders.map((f, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-3 relative">
              <button
                onClick={() => removeFounder(i)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Full Name</Label>
                  <Input value={f.name} onChange={e => updateFounder(i, "name", e.target.value)} placeholder="Founder name" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Role / Title</Label>
                  <Input value={f.role} onChange={e => updateFounder(i, "role", e.target.value)} placeholder="CEO, CTO, COO..." />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                    <Label className="text-xs font-medium">LinkedIn URL</Label>
                  </div>
                  <Input value={f.linkedinUrl} onChange={e => updateFounder(i, "linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/foundername" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-medium">Short Bio</Label>
                  <Textarea value={f.bio} onChange={e => updateFounder(i, "bio", e.target.value)} placeholder="2-3 sentences about this founder..." rows={2} />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2" onClick={addFounder}>
            <Plus className="w-3.5 h-3.5" /> Add founder
          </Button>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Social & Web Links</h3>
          <div className="flex items-center gap-2">
            {visibility.social ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.social} onCheckedChange={() => toggleVis("social")} />
            <span className="text-xs text-muted-foreground">{visibility.social ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Company LinkedIn</Label></div>
            <Input value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/company/yourcompany" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Twitter className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">X / Twitter</Label></div>
            <Input value={form.twitterUrl} onChange={set("twitterUrl")} placeholder="https://x.com/yourcompany" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="px-8" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

function PipelineTab() {
  const [investors, setInvestors] = useState(defaultPipeline);
  const updateStatus = (id: number, status: string) =>
    setInvestors(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[["Total Interested","14","text-foreground"],["Approved Access","6","text-emerald-600"],["Pending Review","4","text-orange-600"]].map(([label, value, color]) => (
          <div key={label} className="bg-card border rounded-xl px-5 py-4">
            <p className={cn("text-2xl font-bold", color)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold">Investor Pipeline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Approve or deny data room access for each investor</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              {["Investor","Type","Commitment","Date","Status","Action"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {investors.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{inv.name[0]}</div>
                    <div><p className="font-medium text-sm">{inv.name}</p><p className="text-xs text-muted-foreground">{inv.firm}</p></div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="outline" className="text-xs font-normal">
                    {inv.type === "DATA_ROOM_REQUEST" ? <><Lock className="w-3 h-3 mr-1" />Data Room</> : <><TrendingUp className="w-3 h-3 mr-1" />Interest</>}
                  </Badge>
                </td>
                <td className="px-5 py-4 font-medium">{inv.amount}</td>
                <td className="px-5 py-4 text-muted-foreground text-xs">{inv.date}</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                    inv.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" :
                    inv.status === "DENIED" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {inv.status === "APPROVED" && <CheckCircle className="w-3 h-3" />}
                    {inv.status === "DENIED" && <XCircle className="w-3 h-3" />}
                    {inv.status === "PENDING" && <Clock className="w-3 h-3" />}
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {inv.status === "PENDING" ? (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(inv.id, "DENIED")}>Deny</Button>
                      <Button size="sm" className="h-7 text-xs" onClick={() => updateStatus(inv.id, "APPROVED")}>Approve</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={() => updateStatus(inv.id, "PENDING")}>Reset</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FounderDashboard() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => { if (!isLoading && !user) setLocation("/login"); }, [isLoading, user]);
  if (isLoading || !user) return null;
  if (!user.onboardingComplete) { setLocation("/onboarding"); return null; }

  const activeTab = location.startsWith("/founder/profile") ? "profile"
    : location.startsWith("/founder/pipeline") ? "pipeline"
    : "overview";

  const TAB_URL: Record<string, string> = {
    overview: "/founder/dashboard",
    profile: "/founder/profile",
    pipeline: "/founder/pipeline",
  };

  const p = user?.profile || {};
  const firstName = user?.name?.split(" ")[0] || "Founder";
  const company = p.company || "Your Startup";
  const stage = p.stage || "Seed";

  return (
    <DashboardLayout navItems={navItems} title="Founder Dashboard" roleLabel="Startup Founder" roleColor="bg-blue-50 text-blue-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Good morning, {firstName} 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{company} · {stage} Round</p>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => setLocation(TAB_URL[v] || "/founder/dashboard")} className="space-y-6">
        <TabsList className="bg-muted/50 border h-9">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs">Manage Profile</TabsTrigger>
          <TabsTrigger value="pipeline" className="text-xs">Investor Pipeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab user={user} /></TabsContent>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="pipeline"><PipelineTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
