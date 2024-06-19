import { z } from "zod";

export const updatePasswordSchema = z.object({
  body: z.object({
    password: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" }),
    oldPassword: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" })
  })
});
