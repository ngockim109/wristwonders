import moment from "moment";
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    membername: z
      .string()
      .min(1, { message: "membername must be greater than 1 characters!" }),
    password: z
      .string({ description: "Password is required" })
      .min(8, { message: "Password must be greater than 8 characters!" }),
    name: z
      .string()
      .min(1, { message: "Name must be greater than 1 characters!" })
      .optional(),
    YOB: z
      .string()
      .refine((value) => moment(value, "YYYY").isValid(), {
        message: "Year of birth must be a valid year!"
      })
      .optional(),
    isAdmin: z.boolean().optional()
  })
});
