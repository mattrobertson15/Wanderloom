import { z } from "zod";
import { geoPointSchema, placeCategorySchema } from "./common";

export const createPlaceSchema = z.object({
  name: z.string().min(1).max(120),
  category: placeCategorySchema.default("other"),
  location: geoPointSchema,
  address: z.string().max(300).optional(),
  country_code: z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/, "country_code must be ISO-3166 alpha-2")
    .optional(),
});

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;

export const placeSearchSchema = z.object({
  query: z.string().min(1).max(120),
  near: geoPointSchema.optional(),
  radiusMeters: z.number().positive().max(200_000).optional(),
});

export type PlaceSearchInput = z.infer<typeof placeSearchSchema>;
