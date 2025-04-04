import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(13),
  password: z.string().min(9)
});
