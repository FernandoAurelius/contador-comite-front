import { z } from "zod";
import { userSchema } from "./User";

export const vendaSchema = z.object({
  id: z.number(),
  date: z.string(),
  itemType: z.enum(
    [
      "REFRI_COPO",
      "REFRI_GARRAFA",
      "PICOLE",
      "CARTELA_BINGO",
      "CORREIO_ELEGANTE",
      "OUTROS"
    ]
  ),
  purchasePrice: z.number(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  notes: z.string(),
  user: userSchema,
});

type Venda = z.infer<typeof vendaSchema>;

export default Venda;
