import { z } from "zod";

export const visibilitySchema = z.enum(["private", "friends", "public"]);

export const placeCategorySchema = z.enum([
  "landmark",
  "restaurant",
  "lodging",
  "activity",
  "nature",
  "city",
  "other",
]);

export const collaboratorRoleSchema = z.enum(["viewer", "editor"]);

export const friendStatusSchema = z.enum(["pending", "accepted", "blocked"]);

export const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const uuidSchema = z.string().uuid();

export const slugSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase, alphanumeric, hyphen-separated");
