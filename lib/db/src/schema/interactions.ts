import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { startupsTable } from "./startups";

export const interactionTypeEnum = pgEnum("interaction_type", [
  "UPVOTE",
  "BOOKMARK",
  "EXPRESS_INTEREST",
  "DATA_ROOM_REQUEST",
]);

export const interactionStatusEnum = pgEnum("interaction_status", [
  "PENDING",
  "APPROVED",
  "DENIED",
]);

export const interactionsTable = pgTable("interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startupsTable.id, { onDelete: "cascade" }),
  type: interactionTypeEnum("type").notNull(),
  status: interactionStatusEnum("status").default("PENDING"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInteractionSchema = createInsertSchema(interactionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Interaction = typeof interactionsTable.$inferSelect;
