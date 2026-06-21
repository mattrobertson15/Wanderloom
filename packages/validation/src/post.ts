import { z } from "zod";
import { visibilitySchema } from "./common";

export const createPostSchema = z.object({
  trip_id: z.string().uuid(),
  album_id: z.string().uuid().optional(),
  place_id: z.string().uuid().optional(),
  title: z.string().max(150).optional(),
  body: z.string().max(5000).optional(),
  post_date: z.string().date().optional(),
  visibility: visibilitySchema.default("private"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial().omit({ trip_id: true });
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const createPhotoSchema = z.object({
  post_id: z.string().uuid().optional(),
  storage_path: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  taken_at: z.string().datetime().optional(),
  sort_order: z.number().int().min(0).default(0),
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
