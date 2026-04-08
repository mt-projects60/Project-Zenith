import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, BarChart3, Briefcase, Globe, ArrowRight, ArrowLeft,
  CheckCircle, Eye, EyeOff, MessageCircle, Phone, Linkedin, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  STARTUP_SECTORS, COMPANY_TYPES, STARTUP_STAGES, BUSINESS_MODELS, CUSTOMER_TYPES,
  INVESTOR_TYPES, INVESTOR_ROLES, PREFERRED_STAGES, INVESTOR_INDUSTRIES, GEOGRAPHIES,
  PROVIDER_COMPANY_SIZES, SERVICE_CATEGORIES, PROVIDER_STAGES, PROVIDER_INDUSTRIES,
} from "@/lib/sectors";

type Role = "startup" | "investor" | "provider" | "enthusiast";

const COUNTRY_CODES = [
  { code: "+91",  flag: "🇮🇳", label: "IN +91" },
  { code: "+1",   flag: "🇺🇸", label: "US +1" },
  { code: "+1",   flag: "🇨🇦", label: "CA +1" },
  { code: "+44",  flag: "🇬🇧", label: "GB +44" },
  { code: "+234", flag: "🇳🇬", label: "NG +234" },
  { code: "+254", flag: "🇰🇪", label: "KE +254" },
  { code: "+233", flag: "🇬🇭", label: "GH +233" },
  { code: "+27",  flag: "🇿🇦", label: "ZA +27" },
  { code: "+20",  flag: "🇪🇬", label: "EG +20" },
  { code: "+971", flag: "🇦🇪", label: "AE +971" },
  { code: "+966", flag: "🇸🇦", label: "SA +966" },
  { code: "+49",  flag: "🇩🇪", label: "DE +49" },
  { code: "+33",  flag: "🇫🇷", label: "FR +33" },
  { code: "+31",  flag: "🇳🇱", label: "NL +31" },
  { code: "+47",  flag: "🇳🇴", label: "NO +47" },
  { code: "+46",  flag: "🇸🇪", label: "SE +46" },
  { code: "+86",  flag: "🇨🇳", label: "CN +86" },
  { code: "+81",  flag: "🇯🇵", label: "JP +81" },
  { code: "+82",  flag: "🇰🇷", label: "KR +82" },
  { code: "+65",  flag: "🇸🇬", label: "SG +65" },
  { code: "+60",  flag: "🇲🇾", label: "MY +60" },
  { code: "+62",  flag: "🇮🇩", label: "ID +62" },
  { code: "+55",  flag: "🇧🇷", label: "BR +55" },
  { code: "+52",  flag: "🇲🇽", label: "MX +52" },
  { code: "+54",  flag: "🇦🇷", label: "AR +54" },
  { code: "+57",  flag: "🇨🇴", label: "CO +57" },
  { code: "+212", flag: "🇲🇦", label: "MA +212" },
  { code: "+213", flag: "🇩🇿", label: "DZ +213" },
  { code: "+216", flag: "🇹🇳", label: "TN +216" },
  { code: "+256", flag: "🇺🇬", label: "UG +256" },
  { code: "+255", flag: "🇹🇿", label: "TZ +255" },
  { code: "+251", flag: "🇪🇹", label: "ET +251" },
  { code: "+221", flag: "🇸🇳", label: "SN +221" },
  { code: "+225", flag: "🇨🇮", label: "CI +225" },
  { code: "+237", flag: "🇨🇲", label: "CM +237" },
];

const roles = [
  { id: "startup" as Role,    title: "I'm a Startup",    subtitle: "Seeking capital & connections", icon: <Rocket className="w-6 h-6" />,    color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-500",   ring: "ring-blue-200"   },
  { id: "investor" as Role,   title: "I'm an Investor",  subtitle: "Deploying capital & deal flow", icon: <BarChart3 className="w-6 h-6" />,  color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-500",ring: "ring-emerald-200" },
  { id: "provider" as Role,   title: "Service Provider", subtitle: "Helping startups scale",        icon: <Briefcase className="w-6 h-6" />, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-500", ring: "ring-violet-200"  },
  { id: "enthusiast" as Role, title: "Enthusiast",       subtitle: "Exploring the ecosystem",      icon: <Globe className="w-6 h-6" />,     color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-500", ring: "ring-orange-200"  },
] as const;

function getStepLabels(role: Role | null): string[] {
  if (role === "startup")    return ["Role", "Account", "Company", "Done"];
  if (role === "investor")   return ["Role", "Account", "Investment", "Done"];
  if (role === "provider")   return ["Role", "Account", "Company", "Services", "Done"];
  if (role === "enthusiast") return ["Role", "Account", "Done"];
  return ["Role", "Account", "Done"];
}

function Field({ label, required, hint, children, error }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode; error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium">
        {label}{required && " *"}
        {hint && <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ value, onChange, placeholder, options, error }: {
  value: string; onChange: (v: string) => void; placeholder: string; options: string[]; error?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={cn("w-full h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring", error ? "border-red-400" : "border-input")}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function MultiChip({ options, selected, onToggle, max }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const isSelected = selected.includes(opt);
        const disabled = !isSelected && max !== undefined && selected.length >= max;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => !disabled && onToggle(opt)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border font-medium transition-all",
              isSelected ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40",
              disabled && "opacity-40 cursor-not-allowed",
            )}
          >{opt}</button>
        );
      })}
    </div>
  );
}

interface FormData {
  firstName: string; lastName: string; email: string; password: string;
  phone: string; countryCode: string; whatsappActive: boolean; linkedin: string;
  startupName: string; registeredName: string; companyType: string;
  sector: string; subsector: string; sectorOther: string;
  tags: string; startupStage: string; businessModel: string; customerType: string;
  investorType: string; firmName: string; investorRole: string;
  preferredStages: string[]; investorIndustries: string[]; geographies: string[];
  minCheck: string; maxCheck: string; checkCurrency: string;
  companyName: string; providerRegisteredName: string; providerCompanyType: string;
  companyWebsite: string; city: string; country: string; companySize: string;
  serviceCategories: string[]; valueProp: string; serviceDescription: string;
  providerStages: string[]; providerIndustries: string[]; providerGeographies: string[];
  notableClients: string;
  enthusiastBackground: string;
}

const emptyForm: FormData = {
  firstName: "", lastName: "", email: "", password: "",
  phone: "", countryCode: "+91", whatsappActive: false, linkedin: "",
  startupName: "", registeredName: "", companyType: "",
  sector: "", subsector: "", sectorOther: "",
  tags: "", startupStage: "", businessModel: "", customerType: "",
  investorType: "", firmName: "", investorRole: "",
  preferredStages: [], investorIndustries: [], geographies: [],
  minCheck: "", maxCheck: "", checkCurrency: "USD",
  companyName: "", providerRegisteredName: "", providerCompanyType: "",
  companyWebsite: "", city: "", country: "", companySize: "",
  serviceCategories: [], valueProp: "", serviceDescription: "",
  providerStages: [], providerIndustries: [], providerGeographies: [],
  notableClients: "",
  enthusiastBackground: "",
};

type Errors = Partial<Record<keyof FormData | string, string>>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { registerUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});

  const role = roles.find(r => r.id === selectedRole);
  const stepLabels = getStepLabels(selectedRole);
  const totalSteps = stepLabels.length;
  const successStep = totalSteps;

  const sectorObj = useMemo(() => STARTUP_SECTORS.find(s => s.label === form.sector), [form.sector]);
  const subsectors = sectorObj?.subsectors ?? [];

  const upd = useCallback((k: keyof FormData, v: string | boolean | string[]) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }, []);

  const toggleMulti = useCallback((k: keyof FormData, v: string, max?: number) => {
    setForm(f => {
      const arr = f[k] as string[];
      if (arr.includes(v)) return { ...f, [k]: arr.filter((x: string) => x !== v) };
      if (!max || arr.length < max) return { ...f, [k]: [...arr, v] };
      return f;
    });
  }, []);

  const validateStep2 = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim())  e.firstName = "Required";
    if (!form.lastName.trim())   e.lastName  = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (!form.phone.trim())      e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3Startup = (): boolean => {
    const e: Errors = {};
    if (!form.startupName.trim()) e.startupName = "Required";
    if (!form.sector)             e.sector = "Please select a sector";
    if (form.sector === "Other" && !form.sectorOther.trim()) e.sectorOther = "Please specify";
    if (!form.startupStage)       e.startupStage = "Please select a stage";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3Investor = (): boolean => {
    const e: Errors = {};
    if (!form.investorType)   e.investorType = "Please select investor type";
    if (!form.firmName.trim()) e.firmName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3Provider = (): boolean => {
    const e: Errors = {};
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.city.trim())        e.city = "Required";
    if (!form.country.trim())     e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && selectedRole) { setStep(2); return; }
    if (step === 2) { if (validateStep2()) setStep(3); return; }
    if (step === 3) {
      if (selectedRole === "startup"    && !validateStep3Startup())  return;
      if (selectedRole === "investor"   && !validateStep3Investor()) return;
      if (selectedRole === "provider"   && !validateStep3Provider()) return;
      if (selectedRole === "provider")  { setStep(4); return; }
      submit();
      return;
    }
    if (step === 4 && selectedRole === "provider") { submit(); return; }
  };

  const submit = async () => {
    setSubmitting(true);
    setApiError("");
    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const sector = form.sector === "Other" ? form.sectorOther : form.sector;
      const result = await registerUser({
        name, email: form.email.trim().toLowerCase(), password: form.password,
        role: selectedRole!,
        phone: `${form.countryCode}${form.phone.trim().replace(/^0/, "")}`,
        whatsappActive: form.whatsappActive,
        sector,
      });
      if (result.error) { setApiError(result.error); setSubmitting(false); return; }
      setStep(successStep);
      setTimeout(() => setLocation("/pending-approval"), 2200);
    } catch {
      setApiError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold text-lg">Z</div>
          <span className="font-bold text-lg tracking-tight">Project Zenith</span>
        </Link>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-foreground hover:underline">Log in</Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-6 max-w-2xl py-4">
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                    done || active ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>
                    {done ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className={cn("text-xs font-medium hidden sm:block truncate", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                  {s < totalSteps && <div className={cn("flex-1 h-px", step > s ? "bg-foreground" : "bg-border")} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center px-4 pt-10 pb-16">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">

            {/* ─── STEP 1: Role ─── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-8">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">How are you here?</h1>
                  <p className="text-muted-foreground">Select your primary role to get the right experience.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {roles.map(r => (
                    <button key={r.id} onClick={() => setSelectedRole(r.id)}
                      className={cn("flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-150 hover:shadow-sm",
                        selectedRole === r.id ? cn("shadow-md scale-[1.02]", r.border, "ring-4", r.ring) : "border-border hover:border-muted-foreground/40")}>
                      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", r.bg, r.color)}>{r.icon}</div>
                      <div><p className="font-bold">{r.title}</p><p className="text-xs text-muted-foreground mt-0.5">{r.subtitle}</p></div>
                    </button>
                  ))}
                </div>
                <Button size="lg" className="w-full rounded-xl gap-2" disabled={!selectedRole} onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* ─── STEP 2: Account info (all roles) ─── */}
            {step === 2 && role && (
              <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
                <div>
                  <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className={cn("inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3", role.bg, role.color)}>
                    {role.icon} {role.title}
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">Create your account</h1>
                  <p className="text-sm text-muted-foreground">All fields marked * are required. Your profile will be reviewed before going live.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="First name" required error={errors.firstName}>
                      <Input placeholder="Jane" value={form.firstName} onChange={e => upd("firstName", e.target.value)} className={errors.firstName ? "border-red-400" : ""} />
                    </Field>
                    <Field label="Last name" required error={errors.lastName}>
                      <Input placeholder="Doe" value={form.lastName} onChange={e => upd("lastName", e.target.value)} className={errors.lastName ? "border-red-400" : ""} />
                    </Field>
                  </div>
                  <Field label="Work email" required error={errors.email}>
                    <Input type="email" placeholder="you@company.com" value={form.email} onChange={e => upd("email", e.target.value)} className={errors.email ? "border-red-400" : ""} />
                  </Field>
                  <Field label="LinkedIn profile" hint="Recommended" error={errors.linkedin}>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                      <Input placeholder="linkedin.com/in/yourname" value={form.linkedin} onChange={e => upd("linkedin", e.target.value)} className="pl-9" />
                    </div>
                    <p className="text-xs text-muted-foreground">Builds credibility with investors and partners.</p>
                  </Field>
                  <Field label="Phone number" required error={errors.phone}>
                    <div className="flex gap-2">
                      <select value={form.countryCode} onChange={e => upd("countryCode", e.target.value)}
                        className="border rounded-lg px-2 py-2 text-sm bg-background shrink-0 w-36 font-medium">
                        {COUNTRY_CODES.map(c => <option key={c.label} value={c.code}>{c.flag} {c.label}</option>)}
                      </select>
                      <Input placeholder="801 000 0001" value={form.phone} onChange={e => upd("phone", e.target.value)} className={cn("flex-1", errors.phone ? "border-red-400" : "")} />
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer mt-2">
                      <div onClick={() => upd("whatsappActive", !form.whatsappActive)}
                        className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer", form.whatsappActive ? "bg-green-500 border-green-500" : "border-muted-foreground/40")}>
                        {form.whatsappActive && <svg viewBox="0 0 10 8" className="w-3 h-3"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">WhatsApp is active on this number</span>
                    </label>
                  </Field>
                  <Field label="Password" required error={errors.password}>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters" value={form.password}
                        onChange={e => upd("password", e.target.value)} className={cn("pr-10", errors.password ? "border-red-400" : "")} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                </div>

                <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* ─── STEP 3: Startup — Company Info ─── */}
            {step === 3 && selectedRole === "startup" && role && (
              <motion.div key="s3-startup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
                <div>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">About your startup</h1>
                  <p className="text-sm text-muted-foreground">This information shapes your public profile and helps investors find you.</p>
                </div>
                <div className="space-y-4">
                  <Field label="Startup / brand name" required error={errors.startupName}>
                    <Input placeholder="e.g. NovaPay" value={form.startupName} onChange={e => upd("startupName", e.target.value)} className={errors.startupName ? "border-red-400" : ""} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Registered company name" hint="Recommended" error={errors.registeredName}>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="NovaPay Technologies Ltd." value={form.registeredName} onChange={e => upd("registeredName", e.target.value)} className="pl-9" />
                      </div>
                    </Field>
                    <Field label="Company / entity type" error={errors.companyType}>
                      <SelectField value={form.companyType} onChange={v => upd("companyType", v)} placeholder="Select type…" options={COMPANY_TYPES} error={errors.companyType} />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Primary sector" required error={errors.sector}>
                      <select value={form.sector} onChange={e => { upd("sector", e.target.value); upd("subsector", ""); }}
                        className={cn("w-full h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring", errors.sector ? "border-red-400" : "border-input")}>
                        <option value="">Select sector…</option>
                        {STARTUP_SECTORS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                      </select>
                      {errors.sector && <p className="text-xs text-red-500">{errors.sector}</p>}
                    </Field>
                    {subsectors.length > 0 && (
                      <Field label="Subsector" hint="Optional">
                        <SelectField value={form.subsector} onChange={v => upd("subsector", v)} placeholder="Select subsector…" options={subsectors} />
                      </Field>
                    )}
                    {form.sector === "Other" && (
                      <Field label="Specify sector" required error={errors.sectorOther}>
                        <Input placeholder="e.g. Space propulsion" value={form.sectorOther} onChange={e => upd("sectorOther", e.target.value)} className={errors.sectorOther ? "border-red-400" : ""} />
                      </Field>
                    )}
                  </div>
                  <Field label="Tags" hint="Optional — up to 5 keywords" error={errors.tags}>
                    <Input placeholder="e.g. Cross-border payments, B2B fintech, Stablecoin" value={form.tags} onChange={e => upd("tags", e.target.value)} />
                    <p className="text-xs text-muted-foreground">Separate with commas. Helps with search and discoverability.</p>
                  </Field>
                  <Field label="Startup stage" required error={errors.startupStage}>
                    <div className="flex flex-wrap gap-2">
                      {STARTUP_STAGES.map(s => (
                        <button key={s} type="button" onClick={() => upd("startupStage", s)}
                          className={cn("text-xs px-3 py-1.5 rounded-full border font-medium transition-all",
                            form.startupStage === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40")}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors.startupStage && <p className="text-xs text-red-500">{errors.startupStage}</p>}
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Business model" hint="Optional">
                      <SelectField value={form.businessModel} onChange={v => upd("businessModel", v)} placeholder="Select model…" options={BUSINESS_MODELS} />
                    </Field>
                    <Field label="Customer type" hint="Optional">
                      <div className="flex flex-wrap gap-2">
                        {CUSTOMER_TYPES.map(t => (
                          <button key={t} type="button" onClick={() => upd("customerType", form.customerType === t ? "" : t)}
                            className={cn("text-xs px-3 py-1.5 rounded-full border font-medium transition-all",
                              form.customerType === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/40")}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>
                {apiError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}
                <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleNext} disabled={submitting}>
                  {submitting ? "Submitting…" : <><span>Submit application</span><ArrowRight className="w-4 h-4" /></>}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}

            {/* ─── STEP 3: Investor — Investment Info ─── */}
            {step === 3 && selectedRole === "investor" && role && (
              <motion.div key="s3-investor" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
                <div>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">Investment profile</h1>
                  <p className="text-sm text-muted-foreground">Help founders understand who you are and what you look for.</p>
                </div>
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Investor type" required error={errors.investorType}>
                      <SelectField value={form.investorType} onChange={v => upd("investorType", v)} placeholder="Select type…" options={INVESTOR_TYPES} error={errors.investorType} />
                    </Field>
                    <Field label="Your role" hint="Optional">
                      <SelectField value={form.investorRole} onChange={v => upd("investorRole", v)} placeholder="e.g. Partner" options={INVESTOR_ROLES} />
                    </Field>
                  </div>
                  <Field label="Organisation / fund name" required error={errors.firmName}>
                    <Input placeholder="Sequoia Capital" value={form.firmName} onChange={e => upd("firmName", e.target.value)} className={errors.firmName ? "border-red-400" : ""} />
                  </Field>
                  <Field label="Preferred stages" hint="Multi-select">
                    <MultiChip options={PREFERRED_STAGES} selected={form.preferredStages} onToggle={v => toggleMulti("preferredStages", v)} />
                  </Field>
                  <Field label="Industries of interest" hint="Multi-select">
                    <MultiChip options={INVESTOR_INDUSTRIES} selected={form.investorIndustries} onToggle={v => toggleMulti("investorIndustries", v)} />
                  </Field>
                  <Field label="Geographies investing in" hint="Multi-select">
                    <MultiChip options={GEOGRAPHIES} selected={form.geographies} onToggle={v => toggleMulti("geographies", v)} />
                  </Field>
                  <Field label="Typical check size">
                    <div className="flex items-center gap-3 flex-wrap">
                      <select value={form.checkCurrency} onChange={e => upd("checkCurrency", e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-background font-medium">
                        {["USD","EUR","GBP","NGN","KES","INR","AED","ZAR"].map(c => <option key={c}>{c}</option>)}
                      </select>
                      <Input placeholder="Min e.g. 10,000" value={form.minCheck} onChange={e => upd("minCheck", e.target.value)} className="flex-1 min-w-28" />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input placeholder="Max e.g. 250,000" value={form.maxCheck} onChange={e => upd("maxCheck", e.target.value)} className="flex-1 min-w-28" />
                    </div>
                  </Field>
                </div>
                {apiError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}
                <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleNext} disabled={submitting}>
                  {submitting ? "Submitting…" : <><span>Submit application</span><ArrowRight className="w-4 h-4" /></>}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}

            {/* ─── STEP 3: Provider — Company Info ─── */}
            {step === 3 && selectedRole === "provider" && role && (
              <motion.div key="s3-provider" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
                <div>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">Company information</h1>
                  <p className="text-sm text-muted-foreground">Tell us about your firm so founders can find you.</p>
                </div>
                <div className="space-y-4">
                  <Field label="Company name" required error={errors.companyName}>
                    <Input placeholder="e.g. Okafor Law Group" value={form.companyName} onChange={e => upd("companyName", e.target.value)} className={errors.companyName ? "border-red-400" : ""} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Registered company name" hint="Recommended">
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Legal registered name" value={form.providerRegisteredName} onChange={e => upd("providerRegisteredName", e.target.value)} className="pl-9" />
                      </div>
                    </Field>
                    <Field label="Company / entity type">
                      <SelectField value={form.providerCompanyType} onChange={v => upd("providerCompanyType", v)} placeholder="Select type…" options={COMPANY_TYPES} />
                    </Field>
                  </div>
                  <Field label="Company website" hint="Optional">
                    <Input placeholder="https://yourfirm.com" value={form.companyWebsite} onChange={e => upd("companyWebsite", e.target.value)} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="City" required error={errors.city}>
                      <Input placeholder="Mumbai" value={form.city} onChange={e => upd("city", e.target.value)} className={errors.city ? "border-red-400" : ""} />
                    </Field>
                    <Field label="Country" required error={errors.country}>
                      <Input placeholder="India" value={form.country} onChange={e => upd("country", e.target.value)} className={errors.country ? "border-red-400" : ""} />
                    </Field>
                  </div>
                  <Field label="Company size">
                    <SelectField value={form.companySize} onChange={v => upd("companySize", v)} placeholder="Select size…" options={PROVIDER_COMPANY_SIZES} />
                  </Field>
                </div>
                <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleNext}>
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* ─── STEP 4: Provider — Services ─── */}
            {step === 4 && selectedRole === "provider" && role && (
              <motion.div key="s4-provider" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
                <div>
                  <button onClick={() => setStep(3)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">Your services</h1>
                  <p className="text-sm text-muted-foreground">Help founders understand exactly how you can help them.</p>
                </div>
                <div className="space-y-5">
                  <Field label="Service categories" hint="Select up to 5">
                    <MultiChip options={SERVICE_CATEGORIES} selected={form.serviceCategories} onToggle={v => toggleMulti("serviceCategories", v, 5)} max={5} />
                    {form.serviceCategories.length >= 5 && <p className="text-xs text-amber-600">Maximum 5 categories selected.</p>}
                  </Field>
                  <Field label="One-line value proposition" hint="Max 140 chars" error={errors.valueProp}>
                    <Input
                      placeholder="Legal and compliance support for early-stage startups raising venture capital."
                      value={form.valueProp}
                      onChange={e => e.target.value.length <= 140 && upd("valueProp", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground text-right">{form.valueProp.length}/140</p>
                  </Field>
                  <Field label="Service description" hint="Max 500 chars">
                    <textarea
                      rows={3}
                      placeholder="Describe what you do and how you help startups…"
                      value={form.serviceDescription}
                      onChange={e => e.target.value.length <= 500 && upd("serviceDescription", e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{form.serviceDescription.length}/500</p>
                  </Field>
                  <Field label="Startup stages you work with" hint="Multi-select">
                    <MultiChip options={PROVIDER_STAGES} selected={form.providerStages} onToggle={v => toggleMulti("providerStages", v)} />
                  </Field>
                  <Field label="Industries you specialise in" hint="Multi-select">
                    <MultiChip options={PROVIDER_INDUSTRIES} selected={form.providerIndustries} onToggle={v => toggleMulti("providerIndustries", v)} />
                  </Field>
                  <Field label="Where do you operate?" hint="Multi-select">
                    <MultiChip options={GEOGRAPHIES} selected={form.providerGeographies} onToggle={v => toggleMulti("providerGeographies", v)} />
                  </Field>
                  <Field label="Notable clients" hint="Optional">
                    <Input placeholder="Stripe, Notion, Razorpay" value={form.notableClients} onChange={e => upd("notableClients", e.target.value)} />
                  </Field>
                </div>
                {apiError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}
                <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleNext} disabled={submitting}>
                  {submitting ? "Submitting…" : <><span>Submit application</span><ArrowRight className="w-4 h-4" /></>}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}

            {/* ─── STEP 3: Enthusiast ─── */}
            {step === 3 && selectedRole === "enthusiast" && role && (
              <motion.div key="s3-enthusiast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
                <div>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-1">Your background</h1>
                  <p className="text-sm text-muted-foreground">Help us tailor your experience.</p>
                </div>
                <Field label="I'm primarily from…">
                  <SelectField value={form.enthusiastBackground} onChange={v => upd("enthusiastBackground", v)} placeholder="Select background…" options={["Tech Community", "Media / Journalism", "Academia", "Government", "Corporate Professional", "Student", "Other"]} />
                </Field>
                {apiError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}
                <Button size="lg" className="w-full rounded-xl gap-2" onClick={handleNext} disabled={submitting}>
                  {submitting ? "Submitting…" : <><span>Submit application</span><ArrowRight className="w-4 h-4" /></>}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}

            {/* ─── SUCCESS ─── */}
            {step === successStep && role && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto", role.bg)}>
                  <CheckCircle className={cn("w-10 h-10", role.color)} />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2">Application submitted!</h1>
                  <p className="text-muted-foreground">Our team will review your profile and notify you within 24–48 hours once approved.</p>
                </div>
                <div className="flex justify-center">
                  <motion.div className={cn("h-1.5 rounded-full bg-foreground")} style={{ width: 0 }} animate={{ width: 220 }} transition={{ duration: 2, ease: "easeInOut" }} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
