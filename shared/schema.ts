import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  receiveInstantAlerts: boolean("receive_instant_alerts").default(true),
  receiveDailyDigest: boolean("receive_daily_digest").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  store: text("store").notNull(),
  currentPrice: real("current_price").notNull(),
  targetPrice: real("target_price").notNull(),
  originalPrice: real("original_price"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isBestDeal: boolean("is_best_deal").default(false),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  receiveInstantAlerts: true,
  receiveDailyDigest: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  url: true,
  imageUrl: true,
  store: true,
  currentPrice: true,
  targetPrice: true,
  originalPrice: true,
  userId: true,
});

export const scrapeUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const updateProductSchema = insertProductSchema.partial();

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
