import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    membername: z
      .string()
      .min(1, { message: "membername must be greater than 1 characters!" }),
    password: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" })
  })
});
