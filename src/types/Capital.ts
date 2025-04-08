import { z } from "zod";

export const capitalSchema = z.object({
  id: z.number(),
  currentAmount: z.number(),
  initialAmount: z.number()
});

type Capital = z.infer<typeof capitalSchema>;

export default Capital;
