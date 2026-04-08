import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "startup" | "investor" | "provider" | "enthusiast" | "admin";

export interface UserProfile {
  company?: string;
  industry?: string;
  stage?: string;
  pitch?: string;
  website?: string;
  location?: string;
  founded?: string;
  targetRaise?: string;
  valuation?: string;
  instrument?: string;
  logoUrl?: string;
  pitchDeckUrl?: string;
  pitchVideoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  problem?: string;
  solution?: string;
  whyNow?: string;
  mrr?: string;
  arr?: string;
  growth?: string;
  runway?: string;
  firm?: string;
  checkSize?: string;
  stageFocus?: string;
  industries?: string;
  thesis?: string;
  portfolio?: string;
  firmName?: string;
  category?: string;
  serviceDesc?: string;
  bio?: string;
  displayName?: string;
  title?: string;
  founders?: Array<{ name: string; role: string; linkedinUrl: string; bio: string }>;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "pending" | "approved" | "rejected";
  phone?: string;
  whatsappActive?: boolean;
  sector?: string;
  profile: UserProfile;
  registeredAt?: string;
  onboardingComplete?: boolean;
}

export interface PendingChange {
  id: string;
  fieldPath: string;
  currentValue?: string;
  proposedValue: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; status?: string }>;
  logout: () => Promise<void>;
  registerUser: (data: {
    name: string; email: string; password: string; role: string;
    phone?: string; whatsappActive?: boolean; sector?: string;
  }) => Promise<{ error?: string; user?: AuthUser }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUser: (data: Partial<Pick<AuthUser, "name" | "email">>) => void;
  completeOnboarding: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<{ error?: string }>;
  pendingChanges: PendingChange[];
  refreshPendingChanges: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "startid_jwt";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`/api${path}`, { ...options, headers });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) { setIsLoading(false); return; }
    apiFetch("/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
        else clearToken();
      })
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (user) refreshPendingChanges();
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    const r = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) return { error: data.error, status: data.error };
    setToken(data.token);
    setUser(data.user);
    return {};
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearToken();
    setUser(null);
    setPendingChanges([]);
  };

  const registerUser = async (data: {
    name: string; email: string; password: string; role: string;
    phone?: string; whatsappActive?: boolean; sector?: string;
  }) => {
    const r = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await r.json();
    if (!r.ok) return { error: result.error };
    return { user: result.user };
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const fields: Record<string, string> = {};
    (Object.entries(data) as [string, unknown][]).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fields[k] = String(v);
    });
    if (Object.keys(fields).length === 0) return;
    await apiFetch("/profile/submit-all", {
      method: "POST",
      body: JSON.stringify({ fields }),
    });
    setUser(prev => prev ? { ...prev, profile: { ...prev.profile, ...data } } : prev);
    await refreshPendingChanges();
  };

  const updateUser = (data: Partial<Pick<AuthUser, "name" | "email">>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const completeOnboarding = async () => {
    await apiFetch("/auth/complete-onboarding", { method: "PATCH" });
    setUser(prev => prev ? { ...prev, onboardingComplete: true } : prev);
  };

  const forgotPassword = async (email: string) => {
    await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  const resetPassword = async (token: string, password: string) => {
    const r = await apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    const data = await r.json();
    if (!r.ok) return { error: data.error };
    return {};
  };

  const refreshPendingChanges = async () => {
    if (!getToken()) return;
    try {
      const r = await apiFetch("/profile/pending-changes");
      if (r.ok) {
        const data = await r.json();
        setPendingChanges(
          (data.changes || []).map((c: Record<string, string>) => ({
            id: c.id,
            fieldPath: c.field_path,
            currentValue: c.current_value,
            proposedValue: c.proposed_value,
            status: c.status,
            createdAt: c.created_at,
          }))
        );
      }
    } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      registerUser,
      updateProfile,
      updateUser,
      completeOnboarding,
      forgotPassword,
      resetPassword,
      pendingChanges,
      refreshPendingChanges,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getInitials(name: string): string {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case "startup": return "/founder/dashboard";
    case "investor": return "/investor/dashboard";
    case "provider": return "/provider/dashboard";
    case "admin": return "/admin/dashboard";
    default: return "/community/dashboard";
  }
}
