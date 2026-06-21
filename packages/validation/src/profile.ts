import { z } from "zod";
import { visibilitySchema } from "./common";

export const usernameSchema = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-z0-9_]+$/, "username must be lowercase letters, numbers, underscores");

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  display_name: z.string().min(1).max(60).optional(),
  bio: z.string().max(500).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  default_visibility: visibilitySchema.optional(),
  is_public_profile: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
