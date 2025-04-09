import { z } from "zod";

export const metaSchema = z.object({
  id: z.number(),
  description: z.string(),
  goalValue: z.number(),
  currentValue: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["ATIVA", "CONCLUIDA", "CANCELADA"])
});

type Meta = z.infer<typeof metaSchema>;

export default Meta;
