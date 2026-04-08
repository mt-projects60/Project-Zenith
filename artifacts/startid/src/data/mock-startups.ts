export interface Startup {
  id: string;
  slug: string;
  name: string;
  pitch: string;
  industry: string;
  subsector?: string;
  stage: string;
  targetRaise: string;
  upvotes: number;
  color: string;
  initials: string;
  verified?: boolean;
  claimed?: boolean;
  companyType?: string;
  registeredName?: string;
  businessModel?: string;
  customerType?: string;
  tags?: string[];
}

export const mockStartups: Startup[] = [
  { id: "1",  slug: "novapay",     name: "NovaPay",      pitch: "The Stripe for emerging markets",                   industry: "Fintech",    stage: "Seed",     targetRaise: "$3M",    upvotes: 247, color: "bg-blue-600",   initials: "NP", verified: true,  claimed: true  },
  { id: "2",  slug: "helixai",     name: "HelixAI",      pitch: "AI copilot for clinical trials",                    industry: "HealthTech", stage: "Series A", targetRaise: "$8M",    upvotes: 312, color: "bg-emerald-600",initials: "HA", verified: true,  claimed: true  },
  { id: "3",  slug: "greenloop",   name: "GreenLoop",    pitch: "Circular economy marketplace for B2B waste",        industry: "CleanTech",  stage: "Pre-Seed", targetRaise: "$500K",  upvotes: 89,  color: "bg-green-500",  initials: "GL", verified: false, claimed: false },
  { id: "4",  slug: "fleetos",     name: "FleetOS",      pitch: "Fleet management for last-mile logistics",          industry: "Logistics",  stage: "Seed",     targetRaise: "$2M",    upvotes: 156, color: "bg-slate-800",  initials: "FO", verified: true,  claimed: true  },
  { id: "5",  slug: "mindbridge",  name: "MindBridge",   pitch: "Mental health platform for enterprise teams",       industry: "HealthTech", stage: "Seed",     targetRaise: "$1.5M",  upvotes: 203, color: "bg-indigo-500", initials: "MB", verified: false, claimed: false },
  { id: "6",  slug: "archform",    name: "Archform",     pitch: "Generative AI for architectural design",            industry: "PropTech",   stage: "Pre-Seed", targetRaise: "$750K",  upvotes: 134, color: "bg-zinc-600",   initials: "AF", verified: false, claimed: false },
  { id: "7",  slug: "datavault",   name: "DataVault",    pitch: "Self-sovereign data marketplace",                   industry: "Web3",       stage: "Series A", targetRaise: "$12M",   upvotes: 445, color: "bg-purple-600", initials: "DV", verified: true,  claimed: true  },
  { id: "8",  slug: "carboncore",  name: "CarbonCore",   pitch: "Real-time carbon accounting for supply chains",     industry: "CleanTech",  stage: "Seed",     targetRaise: "$4M",    upvotes: 178, color: "bg-teal-700",   initials: "CC", verified: false, claimed: false },
  { id: "9",  slug: "legalmind",   name: "LegalMind",    pitch: "AI-powered contract intelligence",                  industry: "LegalTech",  stage: "Pre-Seed", targetRaise: "$1M",    upvotes: 267, color: "bg-stone-700",  initials: "LM", verified: false, claimed: false },
  { id: "10", slug: "agrisense",   name: "AgriSense",    pitch: "Precision agriculture via satellite + IoT",         industry: "AgriTech",   stage: "Seed",     targetRaise: "$3.5M",  upvotes: 192, color: "bg-lime-600",   initials: "AS", verified: true,  claimed: true  },
  { id: "11", slug: "reachhq",     name: "ReachHQ",      pitch: "B2B influencer marketplace for SaaS",               industry: "MarTech",    stage: "Seed",     targetRaise: "$2M",    upvotes: 143, color: "bg-pink-500",   initials: "RH", verified: false, claimed: false },
  { id: "12", slug: "quantumrisk", name: "QuantumRisk",  pitch: "Quantum-computing risk modeling for insurers",      industry: "InsurTech",  stage: "Series B", targetRaise: "$25M",   upvotes: 521, color: "bg-violet-800", initials: "QR", verified: true,  claimed: true  },
  { id: "13", slug: "talentgraph", name: "TalentGraph",  pitch: "Skills-based hiring intelligence",                  industry: "HRTech",     stage: "Seed",     targetRaise: "$1.5M",  upvotes: 98,  color: "bg-cyan-600",   initials: "TG", verified: false, claimed: false },
  { id: "14", slug: "solarstack",  name: "SolarStack",   pitch: "Community solar subscription management",           industry: "CleanTech",  stage: "Series A", targetRaise: "$10M",   upvotes: 287, color: "bg-amber-500",  initials: "SS", verified: true,  claimed: true  },
  { id: "15", slug: "neuraldocs",  name: "NeuralDocs",   pitch: "AI medical documentation assistant",                industry: "HealthTech", stage: "Pre-Seed", targetRaise: "$800K",  upvotes: 167, color: "bg-rose-500",   initials: "ND", verified: false, claimed: false },
  { id: "16", slug: "freightflow", name: "FreightFlow",  pitch: "Real-time freight pricing engine",                  industry: "Logistics",  stage: "Seed",     targetRaise: "$2.5M",  upvotes: 211, color: "bg-sky-600",    initials: "FF", verified: false, claimed: false },
  { id: "17", slug: "payroll3",    name: "PayRoll3",     pitch: "Crypto payroll for remote-first teams",             industry: "Fintech",    stage: "Pre-Seed", targetRaise: "$600K",  upvotes: 74,  color: "bg-fuchsia-500",initials: "P3", verified: false, claimed: false },
  { id: "18", slug: "urbanroot",   name: "UrbanRoot",    pitch: "Urban farming infrastructure as a service",         industry: "AgriTech",   stage: "Seed",     targetRaise: "$1.8M",  upvotes: 129, color: "bg-orange-500", initials: "UR", verified: false, claimed: false },
];

export interface StartupProfileData extends Startup {
  location: string;
  founded: string;
  website: string;
  overview: {
    problem: string;
    solution: string;
    whyNow: string;
    tam: string;
    sam: string;
    som: string;
  };
  traction: {
    mrr: string;
    arr: string;
    momGrowth: string;
    totalUsers: string;
    cac: string;
    runway: string;
  };
  team: {
    name: string;
    title: string;
    bio: string;
    initials: string;
  }[];
  funding: {
    committed: number;
    target: number;
    valuation: string;
    instrument: string;
    closeDate: string;
    investorCount: number;
  };
}

export const mockNovaPayProfile: StartupProfileData = {
  ...mockStartups[0],
  companyType: "Private Limited (PVT LTD)",
  registeredName: "NovaPay Technologies Limited",
  subsector: "Payments",
  businessModel: "API / Infrastructure",
  customerType: "B2B",
  tags: ["Cross-border payments", "B2B fintech", "Emerging markets", "Stablecoin"],
  location: "Mumbai, India",
  founded: "2022",
  website: "novapay.io",
  overview: {
    problem: "Cross-border B2B payments in emerging markets are slow (T+3 days), expensive (avg. 5-7% in hidden FX spreads), and unreliable. Existing infrastructure was built for consumer remittance, not high-volume business trade.",
    solution: "A unified API and ledger system that settles cross-border transactions in local currencies instantly. We bypass legacy correspondent banking networks using proprietary liquidity pools and stablecoin routing.",
    whyNow: "Cross-border and emerging market trade is exploding, while global correspondent banking relationships are evolving rapidly. Regulatory frameworks for digital settlement are finally maturing globally.",
    tam: "$150B (Global B2B Cross-Border Payments)",
    sam: "$45B (Emerging Markets B2B Payments)",
    som: "$2.5B (Emerging Markets Cross-Border Settlement)"
  },
  traction: {
    mrr: "$85K",
    arr: "$1.02M",
    momGrowth: "23%",
    totalUsers: "48,000",
    cac: "$12",
    runway: "18 months"
  },
  team: [
    { name: "Amara Okafor", title: "Co-Founder & CEO", bio: "Ex-Stripe emerging markets expansion lead. Scaled payments volume from $0 to $500M across India and Southeast Asia.", initials: "AO" },
    { name: "David Chen", title: "Co-Founder & CTO", bio: "Former Principal Engineer at Plaid. Distributed systems expert with 3 patents in ledger reconciliation.", initials: "DC" },
    { name: "Kwame Mensah", title: "Chief Compliance Officer", bio: "15 years at Standard Chartered. Authored the digital framework for cross-border payment infrastructure in Asia.", initials: "KM" }
  ],
  funding: {
    committed: 1850000,
    target: 3000000,
    valuation: "$18M",
    instrument: "SAFE Note",
    closeDate: "June 30, 2025",
    investorCount: 14
  }
};
