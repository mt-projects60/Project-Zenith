import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { ProfileCompletion } from "@/components/ProfileCompletion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Search, KanbanSquare, DollarSign, User,
  TrendingUp, Filter, ChevronRight, Star, ExternalLink, Linkedin, ImageIcon, Eye, EyeOff,
  MapPin, BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { CURRENCIES, CurrencyOption, convertAmount, parseUsdString } from "@/lib/currency";

const navItems: NavItem[] = [
  { label: "Overview", href: "/investor/dashboard", icon: <LayoutDashboard /> },
  { label: "My Profile", href: "/investor/profile", icon: <User /> },
  { label: "Discover", href: "/investor/discover", icon: <Search /> },
  { label: "Deal Flow", href: "/investor/dealflow", icon: <KanbanSquare />, badge: 12 },
  { label: "Commitments", href: "/investor/commitments", icon: <DollarSign /> },
];

const kanbanColumns = [
  { id: "bookmarked", label: "Bookmarked", color: "bg-slate-100 text-slate-700", cards: [
    { id: 1, name: "NovaPay", industry: "Fintech", stage: "Seed", target: "$3M", committed: 62 },
    { id: 2, name: "HelixAI", industry: "HealthTech", stage: "Series A", target: "$8M", committed: 45 },
  ]},
  { id: "reviewing", label: "Reviewing", color: "bg-blue-50 text-blue-700", cards: [
    { id: 3, name: "DataVault", industry: "Web3", stage: "Series A", target: "$12M", committed: 71 },
  ]},
  { id: "in_conversation", label: "In Conversation", color: "bg-violet-50 text-violet-700", cards: [
    { id: 4, name: "AgriSense", industry: "AgriTech", stage: "Seed", target: "$3.5M", committed: 55 },
  ]},
  { id: "interested", label: "Interested", color: "bg-amber-50 text-amber-700", cards: [
    { id: 5, name: "QuantumRisk", industry: "InsurTech", stage: "Series B", target: "$25M", committed: 88 },
  ]},
  { id: "invested", label: "Invested", color: "bg-emerald-50 text-emerald-700", cards: [
    { id: 6, name: "SolarStack", industry: "CleanTech", stage: "Series A", target: "$10M", committed: 100 },
  ]},
  { id: "passed", label: "Passed", color: "bg-rose-50 text-rose-600", cards: [
    { id: 7, name: "PayRoll3", industry: "Fintech", stage: "Pre-Seed", target: "$600K", committed: 15 },
  ]},
];

const discoverStartups = [
  { id: 1, name: "NovaPay",     industry: "Fintech",    stage: "Seed",     raise: "$3M",   pct: 62,  instrument: "SAFE",        users: "48K",  mrr: "$85K",   verified: true  },
  { id: 2, name: "HelixAI",     industry: "HealthTech", stage: "Series A", raise: "$8M",   pct: 45,  instrument: "Equity",      users: "12K",  mrr: "$210K",  verified: true  },
  { id: 3, name: "DataVault",   industry: "Web3",       stage: "Series A", raise: "$12M",  pct: 71,  instrument: "SAFE",        users: "95K",  mrr: "$340K",  verified: true  },
  { id: 4, name: "QuantumRisk", industry: "InsurTech",  stage: "Series B", raise: "$25M",  pct: 88,  instrument: "Equity",      users: "320K", mrr: "$1.2M",  verified: true  },
  { id: 5, name: "SolarStack",  industry: "CleanTech",  stage: "Series A", raise: "$10M",  pct: 100, instrument: "Convertible", users: "8K",   mrr: "$125K",  verified: true  },
  { id: 6, name: "AgriSense",   industry: "AgriTech",   stage: "Seed",     raise: "$3.5M", pct: 55,  instrument: "SAFE",        users: "5K",   mrr: "$42K",   verified: false },
];

const commitments = [
  { startup: "SolarStack", amount: "$250,000", round: "Series A", date: "Jan 15, 2026", status: "CLOSED" },
  { startup: "QuantumRisk", amount: "$500,000", round: "Series B", date: "Feb 3, 2026", status: "ACTIVE" },
  { startup: "DataVault", amount: "$150,000", round: "Series A", date: "Mar 1, 2026", status: "PENDING" },
];

function KanbanCard({ card }: { card: { id: number; name: string; industry: string; stage: string; target: string; committed: number } }) {
  return (
    <div className="bg-background border rounded-lg p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{card.name}</p>
          <div className="flex gap-1.5 mt-1">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">{card.industry}</Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium">{card.stage}</Badge>
          </div>
        </div>
        <Star className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Target</span>
          <span className="font-semibold">{card.target}</span>
        </div>
        <Progress value={card.committed} className="h-1" />
        <p className="text-[10px] text-muted-foreground text-right">{card.committed}% funded</p>
      </div>
    </div>
  );
}

function OverviewTab({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const p = user?.profile || {};
  const hasMandateSet = !!(p.stageFocus || p.industries || p.checkSize);
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCIES[0]);

  const convertCheck = (val: string) => {
    const usd = parseUsdString(val);
    return usd > 0 ? convertAmount(usd, currency) : val || "—";
  };

  const completionItems = [
    { label: "Organisation / fund name", done: !!p.firmName },
    { label: "Investor type", done: !!p.investorType },
    { label: "Check size range", done: !!p.checkSize },
    { label: "Industries of interest", done: !!p.industries },
    { label: "Preferred stages", done: !!p.stageFocus },
    { label: "Location", done: !!p.location },
    { label: "LinkedIn profile", done: !!p.linkedinUrl },
    { label: "Bio", done: !!p.bio },
  ];
  const profileUrl = user?.name
    ? `${window.location.origin}/investors/${user.name.toLowerCase().replace(/\s+/g, "-")}`
    : undefined;

  return (
    <div className="space-y-8">
      <ProfileCompletion items={completionItems} profileUrl={profileUrl} role="investor" />

      {/* Mandate setup prompt */}
      {!hasMandateSet && (
        <div className="border border-dashed rounded-xl p-6 flex items-start gap-5">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold mb-1">Set your investment mandate</p>
            <p className="text-sm text-muted-foreground mb-3">
              Founders look at your mandate to decide whether to pitch you. Add your check size, stage, and sector focus.
            </p>
            <Button size="sm" variant="outline" className="text-xs">Go to Profile →</Button>
          </div>
        </div>
      )}
      {/* Currency / location bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {p.location && (
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{p.location}</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Focus Area</p>
          <p className="text-xl font-bold">{p.industries || "—"}</p>
          <p className="text-xs text-muted-foreground">{p.stageFocus || "No stage set yet"}</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Check Size</p>
          <p className="text-xl font-bold">{convertCheck(p.checkSize || "")}</p>
          <div className="flex items-center gap-2">
            {p.location && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3"/>{p.location}</span>}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Bookmarked Startups</p>
          <p className="text-3xl font-bold">—</p>
          <p className="text-xs text-muted-foreground">Browse startups to start tracking</p>
        </div>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Recommended Startups</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">View all <ChevronRight className="w-3 h-3" /></Button>
        </div>
        <div className="divide-y">
          {discoverStartups.slice(0, 4).map(s => (
            <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{s.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm">{s.name}</p>
                  {s.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                </div>
                <div className="flex gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px]">{s.industry}</Badge>
                  <Badge variant="outline" className="text-[10px]">{s.stage}</Badge>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">{s.raise}</p>
                <p className="text-xs text-muted-foreground">{s.pct}% funded</p>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs shrink-0">View</Button>
            </div>
          ))}
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
    firm: p.firm || "",
    website: p.website || "",
    checkSize: p.checkSize || "",
    stageFocus: p.stageFocus || "",
    industries: p.industries || "",
    thesis: p.thesis || "",
    portfolio: p.portfolio || "",
    logoUrl: p.logoUrl || "",
    linkedinUrl: p.linkedinUrl || "",
    bio: p.bio || "",
  });

  const [visibility, setVisibility] = useState({
    thesis: true,
    portfolio: true,
    checkSize: true,
    contact: true,
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleVis = (k: keyof typeof visibility) =>
    setVisibility(v => ({ ...v, [k]: !v[k] }));

  const handleSave = () => {
    updateProfile(form);
    toast({ title: "Profile saved", description: "Your changes have been saved successfully." });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Firm Details */}
      <div className="bg-card border rounded-xl p-6 space-y-5">
        <h3 className="font-semibold text-base">Firm Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium">Firm / Fund Name</Label>
            <Input value={form.firm} onChange={set("firm")} placeholder="Sequoia Capital" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium">Website URL</Label>
            <Input value={form.website} onChange={set("website")} placeholder="https://yourfirm.com" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium">About / Bio</Label>
            <Textarea value={form.bio} onChange={set("bio")} placeholder="Tell founders about your background and focus..." rows={3} />
          </div>
        </div>
      </div>

      {/* Investment Mandate */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Investment Mandate</h3>
          <div className="flex items-center gap-2">
            {visibility.checkSize ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.checkSize} onCheckedChange={() => toggleVis("checkSize")} />
            <span className="text-xs text-muted-foreground">{visibility.checkSize ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Check Size</Label>
            <Input value={form.checkSize} onChange={set("checkSize")} placeholder="$250K – $2M" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Stage Focus</Label>
            <Input value={form.stageFocus} onChange={set("stageFocus")} placeholder="Seed, Series A" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium">Industries of Interest</Label>
            <Input value={form.industries} onChange={set("industries")} placeholder="Fintech, HealthTech, CleanTech" />
          </div>
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Investment Thesis</h3>
          <div className="flex items-center gap-2">
            {visibility.thesis ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.thesis} onCheckedChange={() => toggleVis("thesis")} />
            <span className="text-xs text-muted-foreground">{visibility.thesis ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6">
          <Textarea value={form.thesis} onChange={set("thesis")} placeholder="We back category-defining companies in emerging markets..." rows={4} />
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Notable Portfolio</h3>
          <div className="flex items-center gap-2">
            {visibility.portfolio ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.portfolio} onCheckedChange={() => toggleVis("portfolio")} />
            <span className="text-xs text-muted-foreground">{visibility.portfolio ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6">
          <Input value={form.portfolio} onChange={set("portfolio")} placeholder="NovaPay, HelixAI, SolarStack (comma-separated)" />
        </div>
      </div>

      {/* Branding & Links */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold text-base">Branding & Links</h3>
          <div className="flex items-center gap-2">
            {visibility.contact ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.contact} onCheckedChange={() => toggleVis("contact")} />
            <span className="text-xs text-muted-foreground">{visibility.contact ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Logo URL</Label></div>
            <Input value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://yourfirm.com/logo.png" />
            {form.logoUrl && (
              <img src={form.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-contain border bg-muted mt-2"
                onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">LinkedIn URL</Label></div>
            <Input value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="px-8" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

function DiscoverTab() {
  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search startups..." />
        </div>
        {["Stage", "Industry", "Instrument", "% Funded"].map(f => (
          <Button key={f} variant="outline" size="sm" className="gap-1.5"><Filter className="w-3.5 h-3.5" /> {f}</Button>
        ))}
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              {["Company", "Stage", "Industry", "Raise", "MRR", "% Funded", "Instrument", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground first:pl-5 last:pr-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {discoverStartups.map(s => (
              <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.name[0]}</div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5"><Badge variant="outline" className="text-xs">{s.stage}</Badge></td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.industry}</td>
                <td className="px-4 py-3.5 font-semibold">{s.raise}</td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.mrr}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 min-w-24">
                    <Progress value={s.pct} className="h-1.5 flex-1" />
                    <span className="text-xs font-medium w-8 shrink-0">{s.pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">{s.instrument}</td>
                <td className="pr-5 py-3.5 text-right">
                  <Link href={`/startups/${s.name.toLowerCase()}`}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">View <ExternalLink className="w-3 h-3" /></Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DealFlowTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Track your deal flow pipeline across stages.</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((col) => (
          <div key={col.id} className="shrink-0 w-56 space-y-3">
            <div className="flex items-center justify-between">
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", col.color)}>{col.label}</span>
              <span className="text-xs text-muted-foreground font-medium">{col.cards.length}</span>
            </div>
            <div className="space-y-2.5">
              {col.cards.map(card => <KanbanCard key={card.id} card={card} />)}
              <button className="w-full py-2 border border-dashed rounded-lg text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">+ Add startup</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommitmentsTab() {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b">
        <h3 className="font-semibold">Commitment Ledger</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Track capital deployed across deals</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            {["Startup", "Amount Committed", "Round Type", "Date", "Status"].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {commitments.map((c, i) => (
            <tr key={i} className="hover:bg-muted/20 transition-colors">
              <td className="px-5 py-4 font-medium">{c.startup}</td>
              <td className="px-5 py-4 font-semibold">{c.amount}</td>
              <td className="px-5 py-4 text-muted-foreground text-xs">{c.round}</td>
              <td className="px-5 py-4 text-muted-foreground text-xs">{c.date}</td>
              <td className="px-5 py-4">
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                  c.status === "CLOSED" ? "bg-muted text-muted-foreground" :
                  c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"
                )}>{c.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InvestorDashboard() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => { if (!isLoading && !user) setLocation("/login"); }, [isLoading, user]);
  if (isLoading || !user) return null;
  if (!user.onboardingComplete) { setLocation("/onboarding"); return null; }

  const activeTab = location.startsWith("/investor/profile") ? "profile"
    : location.startsWith("/investor/discover") ? "discover"
    : location.startsWith("/investor/dealflow") ? "dealflow"
    : location.startsWith("/investor/commitments") ? "commitments"
    : "overview";

  const TAB_URL: Record<string, string> = {
    overview: "/investor/dashboard",
    profile: "/investor/profile",
    discover: "/investor/discover",
    dealflow: "/investor/dealflow",
    commitments: "/investor/commitments",
  };

  const p = user?.profile || {};
  const firstName = user?.name?.split(" ")[0] || "Investor";
  const firm = p.firm || "Your Firm";

  return (
    <DashboardLayout navItems={navItems} title="Investor Dashboard" roleLabel="Investor" roleColor="bg-emerald-50 text-emerald-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Welcome back, {firstName} 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{firm} · {p.stageFocus || "Seed, Series A"}</p>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => setLocation(TAB_URL[v] || "/investor/dashboard")} className="space-y-6">
        <TabsList className="bg-muted/50 border h-9">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs">My Profile</TabsTrigger>
          <TabsTrigger value="discover" className="text-xs">Discover</TabsTrigger>
          <TabsTrigger value="dealflow" className="text-xs">Deal Flow</TabsTrigger>
          <TabsTrigger value="commitments" className="text-xs">Commitments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab user={user} /></TabsContent>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="discover"><DiscoverTab /></TabsContent>
        <TabsContent value="dealflow"><DealFlowTab /></TabsContent>
        <TabsContent value="commitments"><CommitmentsTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
