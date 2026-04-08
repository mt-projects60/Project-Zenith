import { pgTable, text, timestamp, uuid, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const startupStageEnum = pgEnum("startup_stage", [
  "PRE_SEED",
  "SEED",
  "SERIES_A",
  "SERIES_B",
  "SERIES_C_PLUS",
]);

export const instrumentEnum = pgEnum("instrument_type", [
  "SAFE",
  "CONVERTIBLE_NOTE",
  "EQUITY",
  "REVENUE_SHARE",
]);

export const startupsTable = pgTable("startups", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  pitch: text("pitch").notNull(),
  description: text("description"),
  stage: startupStageEnum("stage").notNull(),
  industry: text("industry").notNull(),
  location: text("location"),
  foundedYear: integer("founded_year"),
  website: text("website"),
  logoUrl: text("logo_url"),
  pitchDeckUrl: text("pitch_deck_url"),
  pitchVideoUrl: text("pitch_video_url"),
  targetRaise: numeric("target_raise", { precision: 15, scale: 2 }),
  committedAmount: numeric("committed_amount", { precision: 15, scale: 2 }).default("0"),
  valuation: numeric("valuation", { precision: 15, scale: 2 }),
  roundType: instrumentEnum("round_type"),
  closeDate: timestamp("close_date"),
  businessModel: text("business_model"),
  problem: text("problem"),
  solution: text("solution"),
  whyNow: text("why_now"),
  tam: text("tam"),
  sam: text("sam"),
  som: text("som"),
  isPublished: text("is_published").default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const startupMetricsTable = pgTable("startup_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startupsTable.id, { onDelete: "cascade" }),
  mrr: numeric("mrr", { precision: 15, scale: 2 }),
  arr: numeric("arr", { precision: 15, scale: 2 }),
  momGrowthPercent: numeric("mom_growth_percent", { precision: 5, scale: 2 }),
  totalUsers: integer("total_users"),
  cac: numeric("cac", { precision: 10, scale: 2 }),
  burnRate: numeric("burn_rate", { precision: 15, scale: 2 }),
  runwayMonths: integer("runway_months"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const startupTeamTable = pgTable("startup_team", {
  id: uuid("id").primaryKey().defaultRandom(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startupsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  avatarUrl: text("avatar_url"),
  sortOrder: integer("sort_order").default(0),
});

export const insertStartupSchema = createInsertSchema(startupsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStartup = z.infer<typeof insertStartupSchema>;
export type Startup = typeof startupsTable.$inferSelect;
export type StartupMetric = typeof startupMetricsTable.$inferSelect;
export type StartupTeamMember = typeof startupTeamTable.$inferSelect;
