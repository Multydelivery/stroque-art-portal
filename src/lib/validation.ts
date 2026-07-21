import { z } from "zod";

export const indianaBusinessLocations = [
  "Indianapolis, IN",
  "Fishers, IN",
  "Carmel, IN",
  "Fort Wayne, IN",
  "Bloomington, IN",
  "South Bend, IN",
  "Evansville, IN",
  "Lafayette, IN"
] as const;

export const roleSchema = z.enum(["artist", "business"]);

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Use a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: roleSchema
});

export const loginSchema = z.object({
  email: z.string().email("Use a valid email address."),
  password: z.string().min(1, "Password is required.")
});

export const artistProfileSchema = z.object({
  displayName: z.string().min(2, "Display name is required."),
  bio: z.string().min(20, "Bio should be at least 20 characters."),
  location: z.string().min(2, "Location is required."),
  styles: z.array(z.string()).min(1, "Add at least one style."),
  services: z.array(z.string()).min(1, "Add at least one service."),
  startingPrice: z.coerce.number().min(0, "Starting price must be positive."),
  portfolioImages: z.array(z.string().url()).default([])
});

export const businessProfileSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  industry: z.string().min(2, "Industry is required."),
  location: z.string().refine(
    (location) => indianaBusinessLocations.some((indianaLocation) => indianaLocation === location),
    "Choose an Indiana city."
  )
});

export const projectRequestSchema = z.object({
  artistId: z.string().min(1, "Artist is required."),
  spaceType: z.string().min(2, "Space type is required."),
  budget: z.coerce.number().min(1, "Budget is required."),
  timeline: z.string().min(2, "Timeline is required."),
  stylePreference: z.string().min(2, "Style preference is required."),
  description: z.string().min(20, "Share at least 20 characters.")
});

export const requestStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "declined", "completed"])
});
