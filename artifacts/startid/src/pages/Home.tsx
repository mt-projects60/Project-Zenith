import { MainLayout } from "@/components/layout/MainLayout";
import { StartupCard } from "@/components/startup/StartupCard";
import { useStartups } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Search, SlidersHorizontal, Rocket, TrendingUp, Briefcase, Globe,
  ArrowRight, CheckCircle, BarChart3, Shield, Zap, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HERO_WORDS = ["Build", "Curate", "Connect with", "Invest in", "Work with", "Follow"];

const stats = [
  { label: "Startups Listed", value: "2,400+" },
  { label: "Capital Raised via Platform", value: "$180M+" },
  { label: "Active Investors", value: "1,800+" },
  { label: "Countries Represented", value: "62" },
];

const howItWorks = [
  { step: "01", title: "Create your Project Zenith", body: "Founders build a verified, structured profile in minutes — no decks, no email chains.", icon: <Rocket className="w-5 h-5" /> },
  { step: "02", title: "Investors discover you", body: "Qualified investors browse by stage, sector, and traction — your profile does the selling.", icon: <TrendingUp className="w-5 h-5" /> },
  { step: "03", title: "Manage your round", body: "Track interest, approve data room requests, and close your round — all in one place.", icon: <BarChart3 className="w-5 h-5" /> },
];

const roles = [
  {
    id: "startup",
    title: "I'm a Startup",
    subtitle: "Seeking capital",
    body: "Create a verified startup profile, share your traction, manage investor interest, and close your round faster.",
    icon: <Rocket className="w-6 h-6" />,
    cta: "Create your Project Zenith",
    href: "/for-startups",
    color: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-50 text-blue-700",
    ctaClass: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
  },
  {
    id: "investor",
    title: "I'm an Investor",
    subtitle: "Deploying capital",
    body: "Access verified deal flow, filter by stage and sector, manage your pipeline, and connect with the best founders.",
    icon: <TrendingUp className="w-6 h-6" />,
    cta: "Access Deal Flow",
    href: "/for-investors",
    color: "border-emerald-200 hover:border-emerald-400",
    badge: "bg-emerald-50 text-emerald-700",
    ctaClass: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
  },
  {
    id: "provider",
    title: "I'm a Service Provider",
    subtitle: "Helping startups scale",
    body: "List your firm, get inbound leads from funded startups who need legal, tech, finance, or hiring support.",
    icon: <Briefcase className="w-6 h-6" />,
    cta: "List Your Firm",
    href: "/for-providers",
    color: "border-violet-200 hover:border-violet-400",
    badge: "bg-violet-50 text-violet-700",
    ctaClass: "bg-violet-600 hover:bg-violet-700 text-white border-violet-600",
  },
  {
    id: "enthusiast",
    title: "I'm an Enthusiast",
    subtitle: "Exploring the ecosystem",
    body: "Follow top startups, attend pitch events, and stay connected to the world's most ambitious founders.",
    icon: <Globe className="w-6 h-6" />,
    cta: "Join Community",
    href: "/community",
    color: "border-orange-200 hover:border-orange-400",
    badge: "bg-orange-50 text-orange-700",
    ctaClass: "bg-orange-500 hover:bg-orange-600 text-white border-orange-500",
  },
];

const WHY_ZENITH = [
  { icon: <Shield className="w-5 h-5" />, title: "Verified Traction", body: "Every metric on a startup profile is structured and standardized. No vanity numbers." },
  { icon: <Zap className="w-5 h-5" />, title: "Replace the Pitch Deck", body: "Founders share a single profile link instead of emailing a PDF that gets buried in someone's inbox." },
  { icon: <Users className="w-5 h-5" />, title: "Capital-First Design", body: "Every feature is built around moving capital to the best founders. No fluff, no noise." },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Real-time Round Management", body: "Track committed amounts, approve data room access, and close rounds from one dashboard." },
];

export default function Home() {
  const { data: startups, isLoading } = useStartups();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % HERO_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="pt-20 pb-20 px-4 border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl text-center space-y-7">
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1 mb-2">
            Platform For Global Startup Ecosystem
          </Badge>

          {/* Animated headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[62px] font-extrabold tracking-tight leading-tight text-foreground">
            {/* Animated word — line 1 */}
            <span className="block relative h-[1.15em] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.32, 0, 0.67, 0] }}
                  className="block text-primary"
                >
                  {HERO_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            {/* Static second line */}
            <span className="block">Top Startups</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A structured platform where startups showcase traction, investors discover credible opportunities, and the global ecosystem collaborates to accelerate innovation.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8 text-base gap-2 shadow-sm">
                Create Your Profile <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base bg-background">
                Discover Startups
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground/70">
            For founders, investors, service providers, and the global startup community.
          </p>

          {/* Micro-proof */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-muted-foreground/60 font-medium">
            {["Startup profiles", "Investor deal flow", "Pitch events", "Secure data rooms"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2">
                {item}
                {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p className="text-2xl md:text-3xl font-extrabold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main feed */}
      <section className="py-14 container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-tight">Featured This Week</h2>
              <div className="flex items-center gap-2">
                <Link href="/discover">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 hidden sm:flex">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <div className="lg:hidden">
                  <Button variant="outline" size="sm"><SlidersHorizontal className="w-4 h-4 mr-2" />Filters</Button>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex p-4 border rounded-xl gap-4 items-center">
                    <Skeleton className="h-14 w-14 rounded-lg" />
                    <Skeleton className="h-14 w-14 rounded-xl hidden sm:block" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                startups?.slice(0, 10).map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))
              )}
            </div>
            <div className="pt-2 text-center">
              <Link href="/discover">
                <Button variant="outline" size="lg" className="rounded-full px-10 gap-2">
                  View all {startups?.length ?? 18} startups <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar filters */}
          <div className="w-full lg:w-72 shrink-0 hidden lg:block sticky top-24">
            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search companies..." className="pl-9 bg-background" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Stage</h3>
                <div className="flex flex-wrap gap-2">
                  {["Pre-Seed", "Seed", "Series A", "Series B+"].map(stage => (
                    <Badge key={stage} variant="outline" className="cursor-pointer hover:bg-secondary px-3 py-1 text-sm font-medium">
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Industry</h3>
                <div className="flex flex-wrap gap-2">
                  {["Fintech", "HealthTech", "CleanTech", "SaaS", "AI", "Web3"].map(ind => (
                    <Badge key={ind} variant="outline" className="cursor-pointer hover:bg-secondary px-3 py-1 text-sm font-medium">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t">
                <Button variant="ghost" className="w-full text-primary justify-start px-2 text-sm">
                  Clear all filters
                </Button>
              </div>
            </div>

            {/* Quick nav to role pages */}
            <div className="mt-4 bg-card border rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Get started as</p>
              {roles.map(r => (
                <Link key={r.id} href={r.href}>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors group">
                    <span className={cn("p-1.5 rounded-md text-sm", r.badge)}>{r.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Capital discovery, reimagined</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Three steps from idea to closed round.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="bg-background border rounded-2xl p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground tracking-widest">{item.step}</span>
                  <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center text-background">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for — role cards */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Four roles, one platform</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Who is Project Zenith for?</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Every player in the startup capital ecosystem has a home here.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map((role) => (
              <div
                key={role.id}
                className={cn("bg-background border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-md", role.color)}
              >
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", role.badge)}>
                  {role.icon}
                </div>
                <div>
                  <p className="font-bold text-base">{role.title}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{role.subtitle}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{role.body}</p>
                <Link href={role.href}>
                  <Button size="sm" className={cn("w-full rounded-lg gap-1.5 border", role.ctaClass)}>
                    {role.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Project Zenith */}
      <section className="py-20 border-t bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Why Project Zenith</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Capital infrastructure, not a social network</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHY_ZENITH.map((item) => (
              <div key={item.title} className="flex gap-4 bg-background border rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to replace your pitch deck?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join 2,400+ startups who've already created their Project Zenith and are closing rounds faster.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-10 gap-2 text-base">
                Get started free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="rounded-full px-10 text-base bg-background">
                Browse startups
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground flex-wrap">
            {["No credit card required", "Free for startups", "Setup in 5 minutes"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
