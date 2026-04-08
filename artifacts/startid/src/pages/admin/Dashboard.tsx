import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Building2, Upload, Activity, ChevronRight,
  Menu, X, ShieldCheck, Search, Pencil, Trash2, CheckCircle, Clock,
  TrendingUp, ArrowUpRight, FileText, Plus, Download, Eye, AlertCircle,
  BarChart3, Rocket, Briefcase, Globe, UserCheck
} from "lucide-react";

// ─── Mock data ───────────────────────────────────────────────────
const mockUsers = [
  { id: 1, name: "Abiola Lawal",  email: "abiola@novapay.io",    role: "startup",    company: "NovaPay",              joined: "Jan 12, 2026", status: "active" },
  { id: 2, name: "Sarah Chen",   email: "sarah@sequoiacap.com",  role: "investor",   company: "Sequoia Capital",       joined: "Jan 15, 2026", status: "active" },
  { id: 3, name: "Emeka Okafor", email: "emeka@okaforlaw.com",   role: "provider",   company: "Okafor & Associates",   joined: "Feb 2, 2026",  status: "active" },
  { id: 4, name: "Chioma Eze",   email: "chioma@gmail.com",      role: "enthusiast", company: "–",                    joined: "Feb 10, 2026", status: "active" },
  { id: 5, name: "Kofi Mensah",  email: "kofi@helix.ai",         role: "startup",    company: "HelixAI",               joined: "Feb 14, 2026", status: "active" },
  { id: 6, name: "Priya Kapoor", email: "priya@tigerglobal.com", role: "investor",   company: "Tiger Global",          joined: "Feb 20, 2026", status: "active" },
  { id: 7, name: "Lena Fischer", email: "lena@techbridge.io",    role: "provider",   company: "Techbridge Studio",     joined: "Mar 1, 2026",  status: "pending" },
  { id: 8, name: "Jude Obi",     email: "jude@datavault.xyz",    role: "startup",    company: "DataVault",             joined: "Mar 3, 2026",  status: "active" },
  { id: 9, name: "Fatima Hassan",email: "fatima@a16z.com",       role: "investor",   company: "a16z",                  joined: "Mar 5, 2026",  status: "active" },
  { id: 10,"name":"Tunde Bakare",email:"tunde@gmail.com",        role: "enthusiast", company: "–",                    joined: "Mar 8, 2026",  status: "active" },
];

const mockStartups = [
  { id: 1, name: "NovaPay",      industry: "Fintech",    stage: "Seed",     raise: "$3M",  funded: 62, founder: "Abiola Lawal",  status: "active" },
  { id: 2, name: "HelixAI",      industry: "HealthTech", stage: "Series A", raise: "$8M",  funded: 45, founder: "Kofi Mensah",   status: "active" },
  { id: 3, name: "DataVault",    industry: "Web3",       stage: "Series A", raise: "$12M", funded: 71, founder: "Jude Obi",      status: "active" },
  { id: 4, name: "GreenLoop",    industry: "CleanTech",  stage: "Pre-Seed", raise: "$1M",  funded: 30, founder: "Amara Diallo",  status: "active" },
  { id: 5, name: "QuantumRisk",  industry: "InsurTech",  stage: "Series B", raise: "$25M", funded: 88, founder: "Zara Osei",     status: "active" },
  { id: 6, name: "SolarStack",   industry: "CleanTech",  stage: "Series A", raise: "$6M",  funded: 55, founder: "Nadia Traoré", status: "pending" },
  { id: 7, name: "MindBridge",   industry: "HealthTech", stage: "Seed",     raise: "$2M",  funded: 20, founder: "Chris Olu",     status: "active" },
];

const mockActivity = [
  { id: 1, from: "Sequoia Capital",   to: "NovaPay",     type: "DATA_ROOM_REQUEST", status: "pending",  time: "2h ago" },
  { id: 2, from: "a16z",             to: "NovaPay",     type: "BOOKMARK",          status: "info",     time: "5h ago" },
  { id: 3, from: "Bessemer",         to: "HelixAI",     type: "EXPRESS_INTEREST",  status: "pending",  time: "6h ago" },
  { id: 4, from: "Tiger Global",     to: "DataVault",   type: "DATA_ROOM_REQUEST", status: "approved", time: "1d ago" },
  { id: 5, from: "Chioma Eze",       to: "NovaPay",     type: "UPVOTE",            status: "info",     time: "1d ago" },
  { id: 6, from: "Tunde Bakare",     to: "GreenLoop",   type: "UPVOTE",            status: "info",     time: "2d ago" },
  { id: 7, from: "Priya Kapoor",     to: "QuantumRisk", type: "EXPRESS_INTEREST",  status: "approved", time: "2d ago" },
  { id: 8, from: "Fatima Hassan",    to: "HelixAI",     type: "BOOKMARK",          status: "info",     time: "3d ago" },
  { id: 9, from: "Tiger Global",     to: "SolarStack",  type: "DATA_ROOM_REQUEST", status: "denied",   time: "4d ago" },
  { id: 10,"from":"Chioma Eze",      to: "DataVault",   type: "UPVOTE",            status: "info",     time: "4d ago" },
];

// ─── Sub-components ───────────────────────────────────────────────
const roleIcon: Record<string, React.ReactNode> = {
  startup:    <Rocket className="w-3.5 h-3.5" />,
  investor:   <BarChart3 className="w-3.5 h-3.5" />,
  provider:   <Briefcase className="w-3.5 h-3.5" />,
  enthusiast: <Globe className="w-3.5 h-3.5" />,
};
const roleColor: Record<string, string> = {
  startup:    "bg-blue-50 text-blue-700 border-blue-200",
  investor:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  provider:   "bg-violet-50 text-violet-700 border-violet-200",
  enthusiast: "bg-orange-50 text-orange-600 border-orange-200",
};
const actType: Record<string, string> = {
  DATA_ROOM_REQUEST: "bg-amber-50 text-amber-700",
  EXPRESS_INTEREST:  "bg-blue-50 text-blue-700",
  BOOKMARK:          "bg-slate-100 text-slate-600",
  UPVOTE:            "bg-rose-50 text-rose-600",
};
const statusStyle: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  denied:   "bg-red-50 text-red-600",
  info:     "bg-slate-100 text-slate-600",
  active:   "bg-emerald-50 text-emerald-700",
  inactive: "bg-red-50 text-red-600",
};

// ─── Overview Tab ─────────────────────────────────────────────────
function OverviewTab() {
  const token = localStorage.getItem("startid_jwt");
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState({ totalUsers: 0, pendingUsers: 0, approvedUsers: 0, totalActivity: 0 });
  const [recentActivity, setRecentActivity] = useState<Record<string, string>[]>([]);
  const [roleBreakdown, setRoleBreakdown] = useState({ startup: 0, investor: 0, provider: 0, enthusiast: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { headers }).then(r => r.json()),
      fetch("/api/admin/activity?limit=6", { headers }).then(r => r.json()),
      fetch("/api/admin/users", { headers }).then(r => r.json()),
    ]).then(([s, a, u]) => {
      setStats(s);
      setRecentActivity(a.activity || []);
      const users: Record<string, string>[] = u.users || [];
      setRoleBreakdown({
        startup:   users.filter(x => x.role === "STARTUP").length,
        investor:  users.filter(x => x.role === "INVESTOR").length,
        provider:  users.filter(x => x.role === "PROVIDER").length,
        enthusiast:users.filter(x => x.role === "ENTHUSIAST").length,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const actionLabel: Record<string, string> = {
    register: "Signed up", login: "Logged in",
    admin_approved_user: "Account approved", admin_rejected_user: "Account rejected",
    profile_update: "Profile updated", forgot_password: "Password reset req.",
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground text-sm">Loading stats…</div>;

  const total = stats.totalUsers || 1;

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",        value: stats.totalUsers,   sub: "On platform",     icon: <Users className="w-5 h-5" />,     color: "text-foreground" },
          { label: "Approved Accounts",  value: stats.approvedUsers,sub: "Active accounts",  icon: <Rocket className="w-5 h-5" />,   color: "text-blue-600" },
          { label: "Platform Events",    value: stats.totalActivity, sub: "All-time activity",icon: <TrendingUp className="w-5 h-5" />, color: "text-emerald-600" },
          { label: "Pending Approvals",  value: stats.pendingUsers,  sub: "Need review",      icon: <AlertCircle className="w-5 h-5" />,color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-5 space-y-2">
            <div className={cn("w-9 h-9 rounded-lg bg-muted flex items-center justify-center", s.color)}>{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Role breakdown */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <p className="font-semibold">User Role Breakdown</p>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { role: "Startup Founders",  count: roleBreakdown.startup,    color: "bg-blue-500" },
            { role: "Investors",         count: roleBreakdown.investor,   color: "bg-emerald-500" },
            { role: "Service Providers", count: roleBreakdown.provider,   color: "bg-violet-500" },
            { role: "Enthusiasts",       count: roleBreakdown.enthusiast, color: "bg-orange-400" },
          ].map(r => (
            <div key={r.role} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{r.role}</span>
                <span className="font-semibold">{r.count}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", r.color)} style={{ width: `${Math.round((r.count / total) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Recent Platform Activity</p>
          <span className="text-xs text-muted-foreground">{stats.totalActivity} total events</span>
        </div>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No activity recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={a.id || i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
                  {actionLabel[a.action] || a.action}
                </span>
                <span className="text-sm flex-1 truncate font-medium">{a.full_name || a.email || "—"}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────
function UsersTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const token = localStorage.getItem("startid_jwt");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);

  const [users, setUsers] = useState<Record<string, string>[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<Record<string, string> | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", email: "", sector: "", role: "", status: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);

  const loadUsers = () => {
    fetch("/api/admin/users", { headers })
      .then(r => r.json())
      .then(d => {
        const list = (d.users || []).filter((u: Record<string, string>) => u.role !== "ADMIN");
        setUsers(list);
        onCountChange?.(list.length);
        setLoadingUsers(false);
      })
      .catch(() => setLoadingUsers(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const openEdit = (u: Record<string, string>) => {
    setEditingUser(u);
    setEditForm({ full_name: u.full_name || "", email: u.email || "", sector: u.sector || "", role: u.role || "", status: u.status || "" });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH", headers, body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editForm, role: editForm.role.toUpperCase() } : u));
        setEditingUser(null);
      }
    } finally { setSavingEdit(false); }
  };

  const toggleSuspend = async (u: Record<string, string>) => {
    setSuspendingId(u.id);
    try {
      const res = await fetch(`/api/admin/users/${u.id}/suspend`, { method: "PATCH", headers });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: data.user.status } : x));
      }
    } finally { setSuspendingId(null); }
  };

  const roleMap: Record<string, string> = { STARTUP: "startup", INVESTOR: "investor", PROVIDER: "provider", ENTHUSIAST: "enthusiast" };

  const filtered = users.filter(u => {
    const name = u.full_name || "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase());
    const frontendRole = roleMap[u.role] || u.role.toLowerCase();
    const matchRole = roleFilter === "all" || frontendRole === roleFilter;
    return matchSearch && matchRole;
  });

  if (loadingUsers) return <div className="py-20 text-center text-muted-foreground text-sm">Loading users…</div>;

  const statusBadge = (status: string) => {
    if (status === "pending") return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.pending}`}>pending</span>;
    if (status === "approved") return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.approved}`}>approved</span>;
    if (status === "suspended") return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">suspended</span>;
    if (status === "rejected") return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.inactive}`}>rejected</span>;
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{status}</span>;
  };

  return (
    <div className="space-y-5">
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Full Name</Label>
                <Input value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Email</Label>
                <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Sector</Label>
                <Input value={editForm.sector} onChange={e => setEditForm(f => ({ ...f, sector: e.target.value }))} placeholder="e.g. Fintech, Healthtech" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Role</Label>
                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="STARTUP">Startup / Founder</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="PROVIDER">Service Provider</option>
                  <option value="ENTHUSIAST">Enthusiast</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Status</Label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={saveEdit} disabled={savingEdit}>
                {savingEdit ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","startup","investor","provider","enthusiast"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-all",
                roleFilter === r ? "bg-foreground text-background border-foreground" : "border-border hover:border-muted-foreground")}>
              {r === "all" ? "All roles" : r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              {["User","Role","Sector","Joined","Status","Actions"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const fr = roleMap[u.role] || u.role.toLowerCase();
              const isSuspending = suspendingId === u.id;
              return (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">{(u.full_name || "?")[0]}</div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-36">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-36">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize", roleColor[fr] || "bg-muted text-muted-foreground")}>
                      {roleIcon[fr]} {fr}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{u.sector || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{statusBadge(u.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(u)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground border transition-colors"
                        title="Edit user details"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleSuspend(u)}
                        disabled={isSuspending}
                        className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors",
                          u.status === "suspended"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                        )}
                        title={u.status === "suspended" ? "Unsuspend this user" : "Suspend this user"}
                      >
                        {isSuspending ? "…" : u.status === "suspended" ? "Unsuspend" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No users match your filters.</div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} of {users.length} users shown</p>
    </div>
  );
}

// ─── Startups Tab ─────────────────────────────────────────────────
function StartupsTab() {
  const [search, setSearch] = useState("");
  const filtered = mockStartups.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.industry.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search startups…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0"><Download className="w-4 h-4" /> Export CSV</Button>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              {["Startup","Industry","Stage","Target Raise","Funded","Founder","Status","Actions"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-semibold">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{s.industry}</td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{s.stage}</Badge></td>
                <td className="px-4 py-3 font-medium">{s.raise}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-16">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.funded}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.funded}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{s.founder}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", statusStyle[s.status])}>{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CSV Templates ────────────────────────────────────────────────
const csvTemplates: Record<string, string> = {
  startup: [
    "name,email,company_name,industry,stage,target_raise_usd,one_line_pitch,website,location,founded_year",
    "Abiola Lawal,founder@example.com,NovaPay,Fintech,Seed,3000000,The Stripe for emerging markets,https://novapay.io,Mumbai India,2022",
    "Kofi Mensah,kofi@example.com,HelixAI,HealthTech,Series A,8000000,AI-powered diagnostics for emerging markets,https://helix.ai,Bengaluru India,2021",
  ].join("\n"),
  investor: [
    "name,email,firm_name,check_size_min_usd,check_size_max_usd,stage_focus,industries",
    "Sarah Chen,sarah@example.com,Sequoia Capital,250000,2000000,\"Seed, Series A\",\"Fintech, HealthTech\"",
    "Marcus Klein,marcus@example.com,Tiger Global,1000000,10000000,\"Series A, Series B\",\"SaaS, Fintech\"",
  ].join("\n"),
  provider: [
    "name,email,firm_name,category,website,location,service_description",
    "Emeka Okafor,emeka@example.com,Okafor & Associates,Legal,https://okaforlaw.com,Mumbai India,Venture law and compliance for global startups",
    "Lena Fischer,lena@example.com,Techbridge Studio,Technology,https://techbridge.io,Berlin Germany,Engineering and product team augmentation",
  ].join("\n"),
  enthusiast: [
    "name,email,location,bio",
    "Chioma Eze,chioma@example.com,Mumbai India,Startup ecosystem enthusiast and angel scout",
    "Tunde Bakare,tunde@example.com,Delhi India,Founder of two exits - now exploring angel investing",
  ].join("\n"),
};

function downloadCSV(type: string) {
  const content = csvTemplates[type] || csvTemplates.startup;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `startid_${type}_template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Upload Tab ───────────────────────────────────────────────────
function UploadTab() {
  const [mode, setMode] = useState<"individual" | "bulk">("individual");
  const [uploadType, setUploadType] = useState("startup");
  const [submitted, setSubmitted] = useState(false);
  const [bulkFile, setBulkFile] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <p className="font-bold text-lg">Data uploaded successfully</p>
        <p className="text-muted-foreground text-sm">The profile is now live on the platform.</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>Upload another</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Mode toggle */}
      <div className="flex gap-2 bg-muted p-1 rounded-xl w-fit">
        {(["individual", "bulk"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={cn("px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all",
              mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {m === "individual" ? "Individual Profile" : "Bulk Upload (CSV)"}
          </button>
        ))}
      </div>

      {mode === "individual" ? (
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold mb-1">Add a single profile</p>
            <p className="text-sm text-muted-foreground">Create a new user or startup manually.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Profile type</Label>
            <div className="grid sm:grid-cols-4 gap-2">
              {[["startup","Startup"],["investor","Investor"],["provider","Provider"],["enthusiast","Enthusiast"]].map(([val,lbl]) => (
                <button key={val} onClick={() => setUploadType(val)}
                  className={cn("py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                    uploadType === val ? "border-foreground bg-foreground text-background" : "border-border hover:border-muted-foreground")}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Full name *</Label><Input placeholder="Abiola Lawal" /></div>
            <div className="space-y-1.5"><Label>Email address *</Label><Input type="email" placeholder="founder@company.com" /></div>
            {uploadType === "startup" && <>
              <div className="space-y-1.5"><Label>Company name *</Label><Input placeholder="NovaPay" /></div>
              <div className="space-y-1.5"><Label>Industry</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                  {["Fintech","HealthTech","CleanTech","SaaS","AI","Web3","AgriTech","Logistics"].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Stage</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                  {["Pre-Seed","Seed","Series A","Series B","Series B+"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Target Raise ($)</Label><Input type="number" placeholder="3000000" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>One-line pitch</Label><Input placeholder="The Stripe for emerging markets" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Full description</Label><Textarea rows={3} placeholder="Describe the startup in 2–3 sentences…" /></div>
            </>}
            {uploadType === "investor" && <>
              <div className="space-y-1.5"><Label>Firm / Fund name *</Label><Input placeholder="Sequoia Capital" /></div>
              <div className="space-y-1.5"><Label>Check size</Label><Input placeholder="$250K – $2M" /></div>
              <div className="space-y-1.5"><Label>Stage focus</Label><Input placeholder="Seed, Series A" /></div>
              <div className="space-y-1.5"><Label>Industries</Label><Input placeholder="Fintech, HealthTech" /></div>
            </>}
            {uploadType === "provider" && <>
              <div className="space-y-1.5"><Label>Firm name *</Label><Input placeholder="Okafor & Associates" /></div>
              <div className="space-y-1.5"><Label>Service category</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm bg-background">
                  {["Legal","Technology","Hiring","Finance","Marketing","Operations"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Service description</Label><Textarea rows={2} placeholder="Describe your services…" /></div>
            </>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="gap-2" onClick={() => setSubmitted(true)}>
              <Plus className="w-4 h-4" /> Create profile
            </Button>
            <Button variant="outline">Clear form</Button>
          </div>
        </div>
      ) : (
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <div>
            <p className="font-semibold mb-1">Bulk upload via CSV</p>
            <p className="text-sm text-muted-foreground">Upload a CSV file to create multiple profiles at once. Max 500 rows per upload.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Profile type</Label>
            <div className="grid sm:grid-cols-4 gap-2">
              {[["startup","Startups"],["investor","Investors"],["provider","Providers"],["enthusiast","Enthusiasts"]].map(([val,lbl]) => (
                <button key={val} onClick={() => setUploadType(val)}
                  className={cn("py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                    uploadType === val ? "border-foreground bg-foreground text-background" : "border-border hover:border-muted-foreground")}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Download template */}
          <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-4 border border-dashed">
            <FileText className="w-6 h-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">CSV Template — {uploadType}</p>
              <p className="text-xs text-muted-foreground">Download and fill in the required columns.</p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={() => downloadCSV(uploadType)}>
              <Download className="w-3.5 h-3.5" /> Download
            </Button>
          </div>

          {/* Drop zone */}
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl p-12 cursor-pointer hover:border-foreground/40 hover:bg-muted/20 transition-all">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-sm">{bulkFile ? bulkFile : "Drop your CSV here"}</p>
              <p className="text-xs text-muted-foreground mt-1">{bulkFile ? "Ready to upload" : "or click to browse — .csv files only"}</p>
            </div>
            <input type="file" accept=".csv" className="hidden" onChange={e => setBulkFile(e.target.files?.[0]?.name || null)} />
          </label>

          {bulkFile && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700 flex-1">{bulkFile} ready to process</p>
              <button onClick={() => setBulkFile(null)} className="text-emerald-600 hover:text-emerald-800"><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="gap-2" disabled={!bulkFile} onClick={() => { if (bulkFile) setSubmitted(true); }}>
              <Upload className="w-4 h-4" /> Upload & process
            </Button>
            <Button variant="outline">Clear</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────
function ActivityTab() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockActivity.filter(a => {
    const matchType   = typeFilter === "all" || a.type === typeFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchSearch = !search || a.from.toLowerCase().includes(search.toLowerCase()) || a.to.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by account…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border rounded-lg px-3 py-2 text-sm bg-background" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="DATA_ROOM_REQUEST">Data Room Request</option>
          <option value="EXPRESS_INTEREST">Express Interest</option>
          <option value="BOOKMARK">Bookmark</option>
          <option value="UPVOTE">Upvote</option>
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-background" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="info">Info</option>
        </select>
        <Button size="sm" variant="outline" className="gap-1.5"><Download className="w-4 h-4" /> Export</Button>
      </div>

      <div className="text-xs text-muted-foreground">{filtered.length} interaction{filtered.length !== 1 ? "s" : ""} found</div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              {["From","To","Type","Status","Time","Admin Action"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">{a.from}</td>
                <td className="px-4 py-3 text-muted-foreground">{a.to}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap", actType[a.type])}>
                    {a.type.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", statusStyle[a.status])}>{a.status}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{a.time}</td>
                <td className="px-4 py-3">
                  {a.status === "pending" ? (
                    <div className="flex gap-1.5">
                      <button className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Approve</button>
                      <button className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Deny</button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">No activity matches your filters.</div>}
      </div>
    </div>
  );
}

// ─── Approvals Tab ────────────────────────────────────────────────
function ApprovalsTab() {
  const [pendingUsers, setPendingUsers] = useState<Record<string, string>[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const token = localStorage.getItem("startid_jwt");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    const [u, c] = await Promise.all([
      fetch("/api/admin/users/pending", { headers }).then(r => r.json()),
      fetch("/api/admin/profile-changes", { headers }).then(r => r.json()),
    ]);
    setPendingUsers(u.users || []);
    setPendingChanges(c.changes || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approveUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}/approve`, { method: "PATCH", headers });
    load();
  };

  const rejectUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}/reject`, { method: "PATCH", headers, body: JSON.stringify({ reason: rejectReason }) });
    setRejectingId(null);
    setRejectReason("");
    load();
  };

  const approveChange = async (id: string) => {
    await fetch(`/api/admin/profile-changes/${id}/approve`, { method: "PATCH", headers });
    load();
  };

  const rejectChange = async (id: string) => {
    await fetch(`/api/admin/profile-changes/${id}/reject`, { method: "PATCH", headers });
    load();
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground text-sm">Loading approvals…</div>;

  return (
    <div className="space-y-8">
      {/* Pending Users */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Pending Account Approvals</h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">{pendingUsers.length} pending</span>
        </div>
        {pendingUsers.length === 0 ? (
          <div className="border border-dashed rounded-xl p-10 text-center text-muted-foreground text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
            No pending accounts — all caught up!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((u) => (
              <div key={u.id} className="border rounded-xl p-5 bg-card space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{u.full_name}</p>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", {
                        STARTUP: "bg-blue-100 text-blue-700",
                        INVESTOR: "bg-emerald-100 text-emerald-700",
                        PROVIDER: "bg-violet-100 text-violet-700",
                        ENTHUSIAST: "bg-orange-100 text-orange-700",
                      }[u.role as string] || "bg-muted text-muted-foreground")}>{u.role}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{u.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      {u.sector && <span>Sector: <strong>{u.sector}</strong></span>}
                      {u.phone && <span>Phone: <strong>{u.phone}</strong> {(u.whatsapp_active === "true" || String(u.whatsapp_active) === "true") ? "✓ WhatsApp" : ""}</span>}
                      <span>Applied: {new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approveUser(u.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Approve
                    </button>
                    <button onClick={() => setRejectingId(u.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
                {rejectingId === u.id && (
                  <div className="border-t pt-3 space-y-2">
                    <Label className="text-xs">Rejection reason (optional)</Label>
                    <Input placeholder="e.g. Incomplete information provided" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="text-sm" />
                    <div className="flex gap-2">
                      <button onClick={() => rejectUser(u.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Confirm Reject</button>
                      <button onClick={() => setRejectingId(null)} className="text-xs text-muted-foreground underline">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Profile Changes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Pending Profile Updates</h3>
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">{pendingChanges.length} pending</span>
        </div>
        {pendingChanges.length === 0 ? (
          <div className="border border-dashed rounded-xl p-10 text-center text-muted-foreground text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
            No pending profile updates.
          </div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b">
                <tr>
                  {["User","Field","Proposed Value","Submitted","Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingChanges.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.full_name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.field_path}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate text-sm">{c.proposed_value}</p>
                      {c.current_value && <p className="text-xs text-muted-foreground line-through truncate">{c.current_value}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => approveChange(c.id)} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Approve</button>
                        <button onClick={() => rejectChange(c.id)} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Email Logs Tab ───────────────────────────────────────────────
function EmailsTab() {
  const [emails, setEmails] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, string> | null>(null);

  const token = localStorage.getItem("startid_jwt");

  useEffect(() => {
    fetch("/api/admin/emails", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setEmails(d.emails || []); setLoading(false); });
  }, []);

  if (loading) return <div className="py-20 text-center text-muted-foreground text-sm">Loading email logs…</div>;

  return (
    <div className="space-y-5">
      <div className="text-xs text-muted-foreground">
        {emails.length} email{emails.length !== 1 ? "s" : ""} in log — this is your mock email queue (no SMTP configured).
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              {["To","Subject","Sent",""].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emails.map(e => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer" onClick={() => setSelected(e)}>
                <td className="px-4 py-3 font-medium">{e.to_email}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.subject}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-blue-600 underline">View</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {emails.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">No emails sent yet.</div>}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Email Preview</p>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="text-sm space-y-1 border-b pb-3">
              <p><span className="text-muted-foreground">To:</span> {selected.to_email}</p>
              <p><span className="text-muted-foreground">Subject:</span> {selected.subject}</p>
              <p><span className="text-muted-foreground">Sent:</span> {new Date(selected.created_at).toLocaleString()}</p>
            </div>
            <pre className="text-xs bg-muted rounded-lg p-4 whitespace-pre-wrap font-mono overflow-auto max-h-64">{selected.body}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Real Activity Tab ─────────────────────────────────────────────
function RealActivityTab() {
  const [events, setEvents] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("startid_jwt");

  useEffect(() => {
    fetch("/api/admin/activity?limit=100", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setEvents(d.activity || []); setLoading(false); });
  }, []);

  const actionLabel: Record<string, string> = {
    register: "Signed up",
    login: "Logged in",
    forgot_password: "Password reset requested",
    password_reset: "Password reset completed",
    profile_update: "Profile updated",
    admin_approved_user: "Admin approved account",
    admin_rejected_user: "Admin rejected account",
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground text-sm">Loading activity…</div>;

  return (
    <div className="space-y-5">
      <div className="text-xs text-muted-foreground">{events.length} event{events.length !== 1 ? "s" : ""} recorded</div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b">
            <tr>
              {["User","Action","IP","Time"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3">
                  <p className="font-medium">{e.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{e.email || ""}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">{actionLabel[e.action] || e.action}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{e.ip || "—"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">No activity logged yet.</div>}
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────
const tabs = [
  { id: "overview",  label: "Overview",    icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "approvals", label: "Approvals",   icon: <UserCheck className="w-4 h-4" /> },
  { id: "users",     label: "Users",       icon: <Users className="w-4 h-4" /> },
  { id: "startups",  label: "Startups",    icon: <Building2 className="w-4 h-4" /> },
  { id: "upload",    label: "Upload Data", icon: <Upload className="w-4 h-4" /> },
  { id: "emails",    label: "Email Logs",  icon: <FileText className="w-4 h-4" /> },
  { id: "activity",  label: "Activity",    icon: <Activity className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("approvals");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [realUserCount, setRealUserCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
    if (!isLoading && user && user.role !== "admin") setLocation("/");
  }, [isLoading, user]);

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r z-40 flex flex-col transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-16 flex items-center gap-3 px-5 border-b shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
            <span className="font-bold text-lg tracking-tight">Project Zenith</span>
          </Link>
        </div>

        <div className="px-5 py-4 border-b shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
            <ShieldCheck className="w-3 h-3" /> Administrator
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <span className={cn("shrink-0 w-4 h-4", activeTab === tab.id ? "opacity-100" : "opacity-70")}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t space-y-1 shrink-0">
          <Link href="/">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to site
            </div>
          </Link>
          <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("startid_jwt")}` } }); localStorage.removeItem("startid_jwt"); window.location.href = "/login"; }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:text-red-800 cursor-pointer rounded-lg hover:bg-red-50 transition-colors">
            <X className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-20 flex items-center px-4 lg:px-8 gap-4 shrink-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <h1 className="font-semibold text-base tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-700">
              {(user.name || user.email || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 space-y-6">
          {/* Page title */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
              {tabs.find(t => t.id === activeTab)?.label}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {activeTab === "overview"  && "Platform Overview"}
              {activeTab === "approvals" && "Pending Approvals"}
              {activeTab === "users"     && `All Users${realUserCount !== null ? ` (${realUserCount})` : ""}`}
              {activeTab === "startups"  && `All Startups (${mockStartups.length})`}
              {activeTab === "upload"    && "Upload Profile Data"}
              {activeTab === "emails"    && "Email Logs"}
              {activeTab === "activity"  && "Platform Activity"}
            </h2>
          </div>

          {/* Tab content */}
          {activeTab === "overview"  && <OverviewTab />}
          {activeTab === "approvals" && <ApprovalsTab />}
          {activeTab === "users"     && <UsersTab onCountChange={setRealUserCount} />}
          {activeTab === "startups"  && <StartupsTab />}
          {activeTab === "upload"    && <UploadTab />}
          {activeTab === "emails"    && <EmailsTab />}
          {activeTab === "activity"  && <RealActivityTab />}
        </main>
      </div>
    </div>
  );
}
