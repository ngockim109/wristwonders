import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Name must be greater than 1 characters!" })
      .optional()
  })
});