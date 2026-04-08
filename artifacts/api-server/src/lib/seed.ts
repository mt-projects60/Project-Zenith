import { query } from "./db.js";
import { hashPassword } from "./auth.js";

const SEED_USERS = [
  {
    email: "admin@startid.io",
    fullName: "StartID Admin",
    role: "ADMIN",
    password: "StartID@2026",
    status: "approved",
    onboardingComplete: true,
  },
  {
    email: "abiola@novapay.io",
    fullName: "Abiola Lawal",
    role: "STARTUP",
    password: "demo1234",
    status: "approved",
    onboardingComplete: true,
    phone: "+234 801 000 0001",
    whatsappActive: true,
    sector: "Fintech",
  },
  {
    email: "sarah@sequoiacap.com",
    fullName: "Sarah Chen",
    role: "INVESTOR",
    password: "demo1234",
    status: "approved",
    onboardingComplete: true,
    phone: "+1 415 000 0001",
    whatsappActive: false,
    sector: "Venture Capital",
  },
  {
    email: "emeka@okaforlaw.com",
    fullName: "Emeka Okafor",
    role: "PROVIDER",
    password: "demo1234",
    status: "approved",
    onboardingComplete: true,
    phone: "+234 802 000 0001",
    whatsappActive: true,
    sector: "Legal",
  },
  {
    email: "chioma@gmail.com",
    fullName: "Chioma Eze",
    role: "ENTHUSIAST",
    password: "demo1234",
    status: "approved",
    onboardingComplete: true,
    phone: "+234 803 000 0001",
    whatsappActive: true,
    sector: "Tech Community",
  },
];

const SEED_PROFILES: Record<string, Record<string, string>> = {
  "abiola@novapay.io": {
    company: "NovaPay",
    industry: "Fintech",
    stage: "Seed",
    pitch: "The Stripe for emerging markets",
    website: "https://novapay.io",
    location: "Mumbai, India",
    founded: "2022",
    targetRaise: "3000000",
    valuation: "18000000",
    instrument: "SAFE Note",
    problem: "Cross-border B2B payments in emerging markets are slow, expensive, and unreliable.",
    solution: "A unified API and ledger system that settles cross-border transactions in local currencies instantly.",
    whyNow: "Cross-border trade in emerging markets is exploding while regulatory frameworks for digital settlement are maturing globally.",
    mrr: "42000",
    arr: "504000",
    growth: "12",
    runway: "18",
  },
  "sarah@sequoiacap.com": {
    firm: "Sequoia Capital India",
    title: "Principal",
    bio: "I focus on early-stage fintech and infrastructure companies across India and Southeast Asia.",
    website: "https://sequoiacap.com",
    location: "Mumbai, India",
    checkSize: "$250k–$2M",
    stageFocus: "Pre-Seed, Seed",
    industries: "Fintech, Infrastructure, SaaS",
    thesis: "Capital flows to where infrastructure is weakest and talent is strongest. India and SEA are that moment.",
    portfolio: "12",
  },
  "emeka@okaforlaw.com": {
    firmName: "Okafor & Associates",
    category: "Legal",
    serviceDesc: "Full-service law firm specialising in startup incorporation, term sheets, and cross-border compliance.",
    website: "https://okaforlaw.com",
    location: "Mumbai, India",
  },
};

export async function seedDatabase() {
  try {
    for (const u of SEED_USERS) {
      const exists = await query("SELECT id FROM users WHERE email = $1", [u.email]);
      if (exists.rows.length) continue;

      const hash = hashPassword(u.password);
      const result = await query(
        `INSERT INTO users (email, full_name, role, password_hash, status, onboarding_complete, phone, whatsapp_active, sector)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [u.email, u.fullName, u.role, hash, u.status, u.onboardingComplete, u.phone || null, u.whatsappActive || false, u.sector || null]
      );

      if (!result.rows.length) continue;
      const userId = result.rows[0].id;

      const profile = SEED_PROFILES[u.email];
      if (profile) {
        for (const [field, value] of Object.entries(profile)) {
          await query(
            "INSERT INTO profile_changes (user_id, field_path, proposed_value, status) VALUES ($1, $2, $3, 'approved')",
            [userId, field, value]
          );
        }
      }
      console.log(`Seeded: ${u.email}`);
    }
    console.log("Database seeding complete");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}
