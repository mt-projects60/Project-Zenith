import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const investorsTable = pgTable("investors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  firmName: text("firm_name"),
  title: text("title"),
  bio: text("bio"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  checkSizeMin: integer("check_size_min"),
  checkSizeMax: integer("check_size_max"),
  stageFocus: text("stage_focus").array(),
  industryFocus: text("industry_focus").array(),
  portfolioCount: integer("portfolio_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInvestorSchema = createInsertSchema(investorsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInvestor = z.infer<typeof insertInvestorSchema>;
export type Investor = typeof investorsTable.$inferSelect;
