import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("All"),
  tools: jsonb("tools").$type<string[]>().default([]),
  location: text("location").notNull().default(""),
  type: text("type").notNull().default("Full-time"),
  badgeLabel: text("badge_label"),
  badgeColor: text("badge_color"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  formType: text("form_type").notNull(),
  formData: jsonb("form_data").$type<Record<string, unknown>>().notNull(),
  resumeUrl: text("resume_url"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientLogos = pgTable("client_logos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull().default(""),
  section: text("section").notNull().default("home"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  company: text("company").notNull().default(""),
  avatarUrl: text("avatar_url"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  pageSection: text("page_section").notNull().default("home"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable(
  "site_settings",
  {
    id: serial("id").primaryKey(),
    section: text("section").notNull(),
    key: text("key").notNull(),
    value: jsonb("value").$type<unknown>().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    sectionKeyUnique: uniqueIndex("section_key_unique").on(table.section, table.key),
  })
);
