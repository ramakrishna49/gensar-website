import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  tools: z.array(z.string()).default([]),
  location: z.string().default(""),
  type: z.string().default("Full-time"),
  badgeLabel: z.string().optional(),
  badgeColor: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const logoSchema = z.object({
  imageUrl: z.string().url("Valid image URL is required"),
  altText: z.string().default(""),
  section: z.string().default("home"),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().default(""),
  company: z.string().default(""),
  avatarUrl: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.number().min(1).max(5).default(5),
  pageSection: z.string().default("home"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type LogoInput = z.infer<typeof logoSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
