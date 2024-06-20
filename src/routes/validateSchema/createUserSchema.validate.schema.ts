import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    membername: z
      .string()
      .min(1, { message: "Membername must be greater than 1 characters!" }),
    password: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" }),
    name: z
      .string()
      .min(1, { message: "Name must be greater than 1 characters!" })
      .optional(),
    isAdmin: z.boolean().optional()
  })
});
