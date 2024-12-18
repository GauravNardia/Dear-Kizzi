import { z } from "zod";

export const CommentValidation = z.object({
    comment: z.string().nonempty().min(1, { message: "Minimum 3 characters." }),
  });