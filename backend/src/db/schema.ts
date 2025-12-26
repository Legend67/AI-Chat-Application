// backend/src/db/schema.ts

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";

/* -------------------- ENUMS -------------------- */
export const messageSenderEnum = pgEnum("message_sender", [
  "user",
  "assistant",
]);

/* -------------------- CONVERSATIONS / SESSIONS -------------------- */
export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------- MESSAGES -------------------- */
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),

  sender: messageSenderEnum("sender").notNull(), // user | assistant

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------- FAQs (VERSIONED) -------------------- */
export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  version: integer("version").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------- FAQ CHANGE LOGS -------------------- */
export const faqChangeLogs = pgTable("faq_change_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  faqId: uuid("faq_id")
    .notNull()
    .references(() => faqs.id, { onDelete: "cascade" }),

  action: text("action").notNull(), // CREATE | UPDATE | DELETE | ROLLBACK

  oldVersion: integer("old_version"),
  newVersion: integer("new_version"),

  changedAt: timestamp("changed_at").defaultNow().notNull(),
  changedBy: text("changed_by").default("admin"),
});
