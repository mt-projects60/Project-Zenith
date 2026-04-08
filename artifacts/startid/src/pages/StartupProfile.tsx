import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "wouter";
import { useStartupProfile } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Globe, Share, Bookmark, FileText, Lock, Users, Briefcase, TrendingUp, BadgeCheck, Flag, Building2, Tag, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function StartupProfile() {
  const { slug } = useParams();
  const { data: profile, isLoading } = useStartupProfile(slug || "");

  useEffect(() => {
    if (!profile) return;
    const title = `${profile.name} — ${profile.pitch} | Project Zenith`;
    const desc = `${profile.name} is raising ${profile.targetRaise} at ${profile.stage} stage. ${profile.pitch}. Discover deal flow on Project Zenith.`;
    document.title = title;
    const setMeta = (name: string, content: string, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", desc);
    setMeta("og:title", title, true);
    setMeta("og:description", desc, true);
    setMeta("og:url", `${window.location.origin}/startups/${profile.slug}`, true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    return () => { document.title = "Project Zenith"; };
  }, [profile]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Skeleton className="h-[200px] w-full rounded-2xl mb-8" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Startup not found</h1>
        </div>
      </MainLayout>
    );
  }

  const fundingPercent = Math.round((profile.funding.committed / profile.funding.target) * 100);

  return (
    <MainLayout>
      {/* Claim banner — only shown on unclaimed (admin-uploaded) profiles */}
      {!profile.claimed && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <Flag className="w-4 h-4 shrink-0" />
              <span>
                <strong>Is this your company?</strong> This profile was created by the Project Zenith team. Claim it to take control of your listing.
              </span>
            </div>
            <Link href={`/signup?claim=${profile.slug}`}>
              <button className="text-xs font-semibold px-4 py-1.5 rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors shrink-0">
                Claim this page
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className={cn("w-24 h-24 rounded-2xl shrink-0 flex items-center justify-center text-white font-display font-bold text-4xl shadow-md", profile.color)}>
              {profile.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{profile.name}</h1>
                {profile.verified && (
                  <span title="Verified by Project Zenith" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                <Badge className="bg-primary text-primary-foreground hover:bg-primary">{profile.stage}</Badge>
                <Badge variant="outline">{profile.industry}</Badge>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground mb-4">{profile.pitch}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {profile.location}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Founded {profile.founded}</div>
                <div className="flex items-center gap-1.5"><Globe className="w-4 h-4"/> <a href={`https://${profile.website}`} className="hover:text-primary hover:underline">{profile.website}</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content (Left) */}
          <div className="flex-1 w-full min-w-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent mb-8 space-x-6 overflow-x-auto overflow-y-hidden">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 font-semibold data-[state=active]:shadow-none">Overview</TabsTrigger>
                <TabsTrigger value="traction" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 font-semibold data-[state=active]:shadow-none">Traction</TabsTrigger>
                <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 font-semibold data-[state=active]:shadow-none">Team</TabsTrigger>
                <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-3 font-semibold data-[state=active]:shadow-none">Data Room</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
                {/* Company Info card */}
                {(profile.registeredName || profile.companyType || profile.tags?.length || profile.subsector || profile.businessModel || profile.customerType) && (
                  <section className="bg-muted/30 border rounded-xl p-5 space-y-4">
                    <h3 className="text-base font-bold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary"/>Company Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      {profile.registeredName && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Registered Name</p>
                          <p className="font-medium">{profile.registeredName}</p>
                        </div>
                      )}
                      {profile.companyType && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Entity Type</p>
                          <p className="font-medium">{profile.companyType}</p>
                        </div>
                      )}
                      {profile.subsector && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Subsector</p>
                          <p className="font-medium">{profile.subsector}</p>
                        </div>
                      )}
                      {profile.businessModel && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Business Model</p>
                          <p className="font-medium">{profile.businessModel}</p>
                        </div>
                      )}
                      {profile.customerType && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Customer Type</p>
                          <p className="font-medium">{profile.customerType}</p>
                        </div>
                      )}
                    </div>
                    {profile.tags && profile.tags.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Tag className="w-3 h-3"/>Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.tags.map(t => (
                            <span key={t} className="text-xs px-2.5 py-1 bg-background border rounded-full font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary"/> Problem</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{profile.overview.problem}</p>
                </section>
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/> Solution</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{profile.overview.solution}</p>
                </section>
                <section>
                  <h3 className="text-xl font-bold mb-3">Why Now?</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{profile.overview.whyNow}</p>
                </section>
                <section className="bg-secondary/30 rounded-xl p-6 border">
                  <h3 className="text-lg font-bold mb-4">Market Size</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">TAM</div>
                      <div className="font-medium text-lg">{profile.overview.tam}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SAM</div>
                      <div className="font-medium text-lg">{profile.overview.sam}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">SOM</div>
                      <div className="font-medium text-lg text-primary">{profile.overview.som}</div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="traction" className="animate-in fade-in duration-500">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "MRR", value: profile.traction.mrr },
                    { label: "ARR", value: profile.traction.arr },
                    { label: "MoM Growth", value: profile.traction.momGrowth },
                    { label: "Total Users", value: profile.traction.totalUsers },
                    { label: "CAC", value: profile.traction.cac },
                    { label: "Runway", value: profile.traction.runway },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-card border rounded-xl p-5 shadow-sm flex flex-col justify-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold font-display">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="team" className="animate-in fade-in duration-500">
                <div className="space-y-6">
                  {profile.team.map((member) => (
                    <div key={member.name} className="flex flex-col sm:flex-row gap-5 p-5 bg-card border rounded-xl shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground shrink-0 border-2 border-border">
                        {member.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-bold">{member.name}</h4>
                          <Badge variant="secondary" className="font-normal">{member.title}</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group flex items-center gap-4 bg-card shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Pitch Deck</h4>
                      <p className="text-xs text-muted-foreground">PDF • 4.2 MB</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group flex items-center gap-4 bg-card shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Pitch Video</h4>
                      <p className="text-xs text-muted-foreground">MP4 • 3 mins</p>
                    </div>
                  </div>

                  <div className="border rounded-xl p-5 flex items-center justify-between gap-4 bg-muted/30 col-span-1 sm:col-span-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Financial Model & Cap Table</h4>
                        <p className="text-xs text-muted-foreground">Requires verified investor access</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Request Access</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky Funding Card (Right) */}
          <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24">
            <div className="bg-card border-2 border-border/80 shadow-lg rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/80 to-primary"></div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Badge variant="secondary" className="px-3 py-1 text-sm bg-secondary hover:bg-secondary">
                    {profile.funding.instrument}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground font-medium">Raising {profile.targetRaise}</span>
                      <span className="font-bold text-foreground">{fundingPercent}% Committed</span>
                    </div>
                    <Progress value={fundingPercent} className="h-2.5 bg-secondary" />
                    <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                      <span>${(profile.funding.committed / 1000000).toFixed(2)}M committed</span>
                      <span>Target: ${(profile.funding.target / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-t border-b py-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Pre-Money Val</div>
                      <div className="font-bold text-base">{profile.funding.valuation}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Round</div>
                      <div className="font-bold text-base">{profile.stage}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Close Date</div>
                      <div className="font-bold text-base">{profile.funding.closeDate}</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button className="w-full py-6 text-base shadow-sm font-semibold hover:-translate-y-0.5 transition-transform">
                      Express Interest
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent border-border/80">
                      Request Full Data Room
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{profile.funding.investorCount} investors interested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
