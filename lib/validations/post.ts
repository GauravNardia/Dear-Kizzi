import { z } from "zod";

export const CommentValidation = z.object({
    comment: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  });