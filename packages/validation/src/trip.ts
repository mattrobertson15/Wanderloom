import { z } from "zod";
import { slugSchema, visibilitySchema } from "./common";

export const createTripSchema = z
  .object({
    title: z.string().min(1).max(120),
    description: z.string().max(2000).optional(),
    slug: slugSchema,
    start_date: z.string().date().optional(),
    end_date: z.string().date().optional(),
    visibility: visibilitySchema.default("private"),
    cover_photo_id: z.string().uuid().optional(),
  })
  .refine(
    (data) => !data.start_date || !data.end_date || data.start_date <= data.end_date,
    { message: "start_date must be on or before end_date", path: ["end_date"] },
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = createTripSchema.innerType().partial();
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const createAlbumSchema = z.object({
  trip_id: z.string().uuid(),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  cover_photo_id: z.string().uuid().optional(),
  sort_order: z.number().int().min(0).default(0),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

export const updateAlbumSchema = createAlbumSchema.partial().omit({ trip_id: true });
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;

export const inviteCollaboratorSchema = z.object({
  trip_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  role: z.enum(["viewer", "editor"]).default("viewer"),
});

export type InviteCollaboratorInput = z.infer<typeof inviteCollaboratorSchema>;
