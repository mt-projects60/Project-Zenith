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
import { LayoutDashboard, User, Inbox, Eye, EyeOff, MessageSquare, CheckCircle, ImageIcon, Linkedin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: NavItem[] = [
  { label: "Overview", href: "/provider/dashboard", icon: <LayoutDashboard /> },
  { label: "Manage Profile", href: "/provider/profile", icon: <User /> },
  { label: "Leads", href: "/provider/leads", icon: <Inbox />, badge: 3 },
];

const leads = [
  { startup: "NovaPay", category: "Legal", contact: "Abiola Lawal", date: "Mar 11, 2026", status: "NEW", message: "Need a Series A term sheet reviewed and cross-border compliance advice." },
  { startup: "HelixAI", category: "Tech", contact: "Dr. Sarah Okonkwo", date: "Mar 9, 2026", status: "REPLIED", message: "Looking for CTO support for a 3-month product sprint." },
  { startup: "DataVault", category: "Legal", contact: "Marcus Klein", date: "Mar 6, 2026", status: "REPLIED", message: "Token structure and regulatory framework for EU launch." },
  { startup: "AgriSense", category: "Hiring", contact: "James Nwosu", date: "Mar 2, 2026", status: "CLOSED", message: "Need to hire 3 senior engineers with IoT experience." },
  { startup: "GreenLoop", category: "Finance", contact: "Emeka Eze", date: "Feb 28, 2026", status: "CLOSED", message: "Financial model review ahead of Pre-Seed close." },
];

function OverviewTab() {
  const { user } = useAuth();
  const p = user?.profile || {};

  const completionItems = [
    { label: "Company / firm name", done: !!p.firmName },
    { label: "Service category", done: !!p.category },
    { label: "Services description", done: !!p.serviceDesc },
    { label: "Website", done: !!p.website },
    { label: "LinkedIn profile", done: !!p.linkedinUrl },
    { label: "Location", done: !!p.location },
    { label: "Bio", done: !!p.bio },
  ];
  const slug = p.firmName ? p.firmName.toLowerCase().replace(/\s+/g, "-") : "";
  const profileUrl = slug ? `${window.location.origin}/providers/${slug}` : undefined;

  return (
    <div className="space-y-8">
      <ProfileCompletion items={completionItems} profileUrl={profileUrl} role="provider" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground font-medium">Profile Views</p></div>
          <p className="text-3xl font-bold">284</p>
          <p className="text-xs text-emerald-600 font-medium">↑ 18% this month</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <div className="flex items-center gap-2 mb-2"><Inbox className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground font-medium">Inbound Requests</p></div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">5 this week</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground font-medium">Closed Deals</p></div>
          <p className="text-3xl font-bold">7</p>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Recent Leads</h3>
          <Badge variant="outline" className="text-xs">3 new</Badge>
        </div>
        <div className="divide-y">
          {leads.slice(0, 3).map((lead, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-xs font-bold shrink-0">{lead.startup[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm">{lead.startup}</p>
                  <Badge variant="secondary" className="text-[10px]">{lead.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{lead.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{lead.date} · {lead.contact}</p>
              </div>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-1",
                lead.status === "NEW" ? "bg-blue-50 text-blue-700" :
                lead.status === "REPLIED" ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground"
              )}>{lead.status}</span>
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
    firmName: p.firmName || "",
    category: p.category || "",
    website: p.website || "",
    location: p.location || "",
    serviceDesc: p.serviceDesc || "",
    bio: p.bio || "",
    logoUrl: p.logoUrl || "",
    linkedinUrl: p.linkedinUrl || "",
  });

  const [visibility, setVisibility] = useState({
    services: true,
    contact: true,
    bio: true,
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
    <div className="max-w-xl space-y-6">
      {/* Company Details */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Company Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <Label className="text-xs font-medium">Company Name</Label>
            <Input value={form.firmName} onChange={set("firmName")} placeholder="Your company name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Category</Label>
            <Input value={form.category} onChange={set("category")} placeholder="Legal, Finance, Tech..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Location</Label>
            <Input value={form.location} onChange={set("location")} placeholder="Mumbai, India" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Website URL</Label></div>
            <Input value={form.website} onChange={set("website")} placeholder="https://yourcompany.com" />
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold">Services & Description</h3>
          <div className="flex items-center gap-2">
            {visibility.services ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.services} onCheckedChange={() => toggleVis("services")} />
            <span className="text-xs text-muted-foreground">{visibility.services ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">One-line Value Proposition</Label>
            <Input value={form.serviceDesc} onChange={set("serviceDesc")} placeholder="What do you do for startups?" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">About</Label>
            <Textarea rows={4} value={form.bio} onChange={set("bio")} placeholder="Tell startups more about your services..." />
          </div>
        </div>
      </div>

      {/* Branding & Links */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b">
          <h3 className="font-semibold">Branding & Links</h3>
          <div className="flex items-center gap-2">
            {visibility.contact ? <Eye className="w-3.5 h-3.5 text-muted-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
            <Switch checked={visibility.contact} onCheckedChange={() => toggleVis("contact")} />
            <span className="text-xs text-muted-foreground">{visibility.contact ? "Visible" : "Hidden"}</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">Logo URL</Label></div>
            <Input value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://yourcompany.com/logo.png" />
            {form.logoUrl && (
              <img src={form.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-contain border bg-muted mt-2"
                onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 text-muted-foreground" /><Label className="text-xs font-medium">LinkedIn URL</Label></div>
            <Input value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/company/yourcompany" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="px-8" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

function LeadsTab() {
  const [leadList, setLeadList] = useState(leads);
  const markReplied = (i: number) => setLeadList(prev => prev.map((l, idx) => idx === i ? { ...l, status: "REPLIED" } : l));

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Lead Inbox</h3>
        <p className="text-xs text-muted-foreground">{leadList.length} total leads</p>
      </div>
      <div className="divide-y">
        {leadList.map((lead, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-bold shrink-0">{lead.startup[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-semibold">{lead.startup}</p>
                <Badge variant="secondary" className="text-xs">{lead.category}</Badge>
                <span className="text-xs text-muted-foreground">· {lead.contact}</span>
              </div>
              <p className="text-sm text-muted-foreground">{lead.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{lead.date}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                lead.status === "NEW" ? "bg-blue-50 text-blue-700" :
                lead.status === "REPLIED" ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground"
              )}>{lead.status}</span>
              {lead.status === "NEW" && (
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => markReplied(i)}>
                  <MessageSquare className="w-3 h-3" /> Reply
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => { if (!isLoading && !user) setLocation("/login"); }, [isLoading, user]);
  if (isLoading || !user) return null;
  if (!user.onboardingComplete) { setLocation("/onboarding"); return null; }

  const activeTab = location.startsWith("/provider/profile") ? "profile"
    : location.startsWith("/provider/leads") ? "leads"
    : "overview";

  const TAB_URL: Record<string, string> = {
    overview: "/provider/dashboard",
    profile: "/provider/profile",
    leads: "/provider/leads",
  };

  const p = user?.profile || {};
  const firstName = user?.name?.split(" ")[0] || "Provider";
  const firm = p.firmName || "Your Company";

  return (
    <DashboardLayout navItems={navItems} title="Provider Dashboard" roleLabel="Service Provider" roleColor="bg-violet-50 text-violet-700">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Welcome back, {firstName} 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{firm} · {p.category || "Service Provider"}</p>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => setLocation(TAB_URL[v] || "/provider/dashboard")} className="space-y-6">
        <TabsList className="bg-muted/50 border h-9">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs">Manage Profile</TabsTrigger>
          <TabsTrigger value="leads" className="text-xs">Leads</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="leads"><LeadsTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
