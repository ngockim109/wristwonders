import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    rating: z
      .number({ description: "Rating is required" })
      .min(1, { message: "Rating must be 1-3 star!" })
      .max(3, { message: "Rating must be 1-3 star!" }),
    comment: z.string({ description: "Comment is required" })
  })
});
