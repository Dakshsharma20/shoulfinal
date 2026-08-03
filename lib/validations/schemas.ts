import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

export const productSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().trim().min(5).max(200),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  images: z.array(productImageSchema).min(1, "At least one image is required"),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  inStock: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  material: z.string().trim().min(2, "Material is required"),
  color: z.string().trim().optional().or(z.literal("")),
  careInstructions: z.string().trim().min(2, "Care instructions are required"),
  displayOrder: z.coerce.number().int().default(0),
});
export type ProductInput = z.infer<typeof productSchema>;

// Partial version for PATCH-style updates.
export const productUpdateSchema = productSchema.partial();

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  image: z
    .object({ url: z.string().url(), publicId: z.string() })
    .optional(),
  displayOrder: z.coerce.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const settingsSchema = z.object({
  storeName: z.string().trim().min(1, "Store name is required"),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Use digits only, with country code, no + or spaces (e.g. 919876543210)"),
  whatsappMessage: z.string().trim().min(1, "Message is required"),
  instagramUrl: z.string().trim().url("Enter a full URL, e.g. https://www.instagram.com/yourhandle/"),
  instagramHandle: z.string().trim().min(1),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  logo: z.object({ url: z.string().url(), publicId: z.string() }).optional(),
  heroBanner: z.object({ url: z.string().url(), publicId: z.string() }).optional(),
  footerTagline: z.string().trim().min(1),
  footerLocation: z.string().trim().min(1),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
