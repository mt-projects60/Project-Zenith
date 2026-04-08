export interface Sector {
  label: string;
  subsectors: string[];
}

export const STARTUP_SECTORS: Sector[] = [
  { label: "Artificial Intelligence & Machine Learning", subsectors: ["AI infrastructure", "Generative AI", "AI applications", "Computer vision", "NLP"] },
  { label: "Fintech",                                   subsectors: ["Payments", "Lending", "Wealthtech", "Insurtech", "Banking infrastructure", "Crypto / Web3 finance"] },
  { label: "SaaS / Enterprise Software",                subsectors: ["Workflow tools", "CRM", "HR tech", "Dev tools", "Productivity software"] },
  { label: "Healthtech & Biotech",                      subsectors: ["Digital health", "Telemedicine", "Diagnostics", "Biotech", "Medical devices"] },
  { label: "Climate & CleanTech",                       subsectors: ["Renewable energy", "Carbon capture", "Climate SaaS", "Energy storage", "Sustainable materials"] },
  { label: "Consumer / D2C",                            subsectors: ["Consumer brands", "Subscription products", "Personal care", "Lifestyle products"] },
  { label: "E-commerce & Marketplaces",                 subsectors: ["Vertical marketplaces", "Cross-border commerce", "Social commerce", "Logistics tech"] },
  { label: "Mobility & Transportation",                 subsectors: ["EV technology", "Fleet management", "Autonomous vehicles", "Urban mobility"] },
  { label: "Logistics & Supply Chain",                  subsectors: ["Freight tech", "Warehouse automation", "Trade infrastructure", "Last-mile delivery"] },
  { label: "EdTech",                                    subsectors: ["Online learning", "Skill platforms", "Workforce education", "AI tutoring"] },
  { label: "AgriTech & FoodTech",                       subsectors: ["Precision agriculture", "Food innovation", "Supply chain", "Alternative proteins"] },
  { label: "Cybersecurity",                             subsectors: ["Identity security", "Cloud security", "Fraud detection", "Privacy infrastructure"] },
  { label: "Web3 / Blockchain",                         subsectors: ["DeFi", "Infrastructure", "Digital identity", "Tokenization"] },
  { label: "Robotics & Hardware",                       subsectors: ["Industrial robotics", "Drones", "Automation systems", "IoT devices"] },
  { label: "DeepTech",                                  subsectors: ["Quantum", "Space tech", "Advanced materials", "Semiconductor innovation"] },
  { label: "Creator Economy & Media",                   subsectors: ["Creator tools", "Digital media", "Content platforms", "Social tech"] },
  { label: "Travel & Hospitality Tech",                 subsectors: ["Booking platforms", "Travel infrastructure", "Experience platforms"] },
  { label: "GovTech / Public Infrastructure",           subsectors: ["Civic platforms", "Public data", "Digital governance"] },
  { label: "Other",                                     subsectors: [] },
];

export const COMPANY_TYPES = [
  "Private Limited (PVT LTD)",
  "Limited Liability Company (LLC)",
  "Limited Liability Partnership (LLP)",
  "Public Limited Company (PLC)",
  "C-Corporation",
  "S-Corporation",
  "Partnership",
  "Sole Proprietorship",
  "Cooperative",
  "Non-profit / NGO",
  "Not yet registered",
  "Other",
];

export const STARTUP_STAGES = ["Idea", "Pre-seed", "Seed", "Series A", "Series B+", "Growth"];

export const BUSINESS_MODELS = ["SaaS", "Marketplace", "D2C", "Hardware", "Fintech", "API / Infrastructure", "Other"];

export const CUSTOMER_TYPES = ["B2B", "B2C", "B2B2C", "Government"];

export const INVESTOR_TYPES = [
  "Angel Investor",
  "Venture Capital",
  "Family Office",
  "Corporate Venture",
  "Syndicate Lead",
  "Fund Manager",
  "Scout",
  "Investment Platform",
  "Other",
];

export const INVESTOR_ROLES = ["Partner", "Principal", "Associate", "Angel Investor", "Founder investing", "Other"];

export const PREFERRED_STAGES = ["Pre-seed", "Seed", "Series A", "Series B+", "Growth"];

export const INVESTOR_INDUSTRIES = [
  "AI", "Fintech", "SaaS", "Healthtech", "Climate", "Consumer",
  "Logistics", "Cybersecurity", "DeepTech", "Web3", "EdTech",
  "AgriTech", "Mobility", "E-commerce", "Creator Economy",
];

export const GEOGRAPHIES = [
  "North America", "Europe", "Asia-Pacific", "India",
  "MENA", "Latin America", "Global (Remote)",
];

export const PROVIDER_COMPANY_SIZES = [
  "Solo Consultant", "2–10 employees", "11–50 employees", "50–200 employees", "200+",
];

export const SERVICE_CATEGORIES = [
  "Legal & Corporate Structuring",
  "Startup Compliance & Regulatory",
  "Accounting & Tax Advisory",
  "Fundraising Advisory",
  "Pitch Deck & Storytelling",
  "Branding & Marketing",
  "Product Development",
  "Software Development",
  "Hiring & Talent",
  "PR & Media",
  "Growth Marketing",
  "Sales Enablement",
  "Venture Debt / Capital Advisory",
  "Grant Advisory",
  "International Expansion",
  "Banking & Payment Infrastructure",
];

export const PROVIDER_STAGES = ["Idea", "Pre-seed", "Seed", "Series A", "Series B+", "Growth"];

export const PROVIDER_INDUSTRIES = [
  "AI", "Fintech", "SaaS", "Healthtech", "Climate",
  "Consumer", "Logistics", "Web3", "DeepTech", "Mobility",
];
