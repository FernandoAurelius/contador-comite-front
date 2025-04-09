import { z } from "zod";

export const despesaSchema = z.object({
  date: z.string(),
  item: z.string(),
  quantity: z.number(),
  unitCost: z.number(),
  totalCost: z.number(),
  notes: z.string()
});

type Despesa = z.infer<typeof despesaSchema>;

export default Despesa;
