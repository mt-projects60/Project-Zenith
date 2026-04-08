import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StartupCard } from "@/components/startup/StartupCard";
import { useStartups } from "@/hooks/use-startups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Series B+"];
const industries = ["Fintech", "HealthTech", "CleanTech", "SaaS", "AI", "Web3", "AgriTech", "Logistics", "LegalTech", "MarTech", "InsurTech", "HRTech", "PropTech"];
const instruments = ["SAFE", "Equity", "Convertible Note", "Revenue Share"];

export default function Discover() {
  const { data: startups, isLoading } = useStartups();
  const [search, setSearch] = useState("");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const filtered = startups?.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.pitch.toLowerCase().includes(search.toLowerCase()) || s.industry.toLowerCase().includes(search.toLowerCase());
    const matchStage = !selectedStages.length || selectedStages.includes(s.stage);
    const matchIndustry = !selectedIndustries.length || selectedIndustries.includes(s.industry);
    return matchSearch && matchStage && matchIndustry;
  });

  const hasFilters = selectedStages.length || selectedIndustries.length || selectedInstruments.length;

  const clearAll = () => {
    setSelectedStages([]);
    setSelectedIndustries([]);
    setSelectedInstruments([]);
    setSearch("");
  };

  return (
    <MainLayout>
      {/* Header */}
      <section className="border-b bg-muted/20 py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Browse</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Discover Startups</h1>
          <p className="text-muted-foreground max-w-xl">
            Browse {startups?.length ?? 18}+ verified startups actively raising capital. Filter by stage, sector, instrument, and more.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, pitch, or industry..."
                className="pl-9 bg-background"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasFilters ? <span className="bg-background text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{(selectedStages.length + selectedIndustries.length + selectedInstruments.length)}</span> : null}
            </Button>
            {hasFilters ? (
              <Button variant="ghost" className="gap-1.5 text-muted-foreground" onClick={clearAll}>
                <X className="w-4 h-4" /> Clear all
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Filter panel */}
      {showFilters && (
        <section className="border-b bg-background">
          <div className="container mx-auto px-4 max-w-6xl py-5">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Stage</p>
                <div className="flex flex-wrap gap-2">
                  {stages.map(s => (
                    <Badge
                      key={s}
                      variant={selectedStages.includes(s) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1 text-xs font-medium transition-all"
                      onClick={() => toggle(selectedStages, setSelectedStages, s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Industry</p>
                <div className="flex flex-wrap gap-2">
                  {industries.map(ind => (
                    <Badge
                      key={ind}
                      variant={selectedIndustries.includes(ind) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1 text-xs font-medium transition-all"
                      onClick={() => toggle(selectedIndustries, setSelectedIndustries, ind)}
                    >
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Instrument</p>
                <div className="flex flex-wrap gap-2">
                  {instruments.map(ins => (
                    <Badge
                      key={ins}
                      variant={selectedInstruments.includes(ins) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1 text-xs font-medium transition-all"
                      onClick={() => toggle(selectedInstruments, setSelectedInstruments, ins)}
                    >
                      {ins}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="py-10 container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered?.length ?? 0} startups found`}
          </p>
          <div className="flex gap-2">
            {selectedStages.map(s => (
              <Badge key={s} variant="secondary" className="gap-1 text-xs">
                {s} <X className="w-3 h-3 cursor-pointer" onClick={() => toggle(selectedStages, setSelectedStages, s)} />
              </Badge>
            ))}
            {selectedIndustries.map(i => (
              <Badge key={i} variant="secondary" className="gap-1 text-xs">
                {i} <X className="w-3 h-3 cursor-pointer" onClick={() => toggle(selectedIndustries, setSelectedIndustries, i)} />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex p-4 border rounded-xl gap-4 items-center">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <Skeleton className="h-14 w-14 rounded-xl hidden sm:block" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : filtered?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No startups match your filters</p>
              <Button variant="ghost" className="mt-3 text-sm" onClick={clearAll}>Clear filters</Button>
            </div>
          ) : (
            filtered?.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}
