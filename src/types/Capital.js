import { z } from "zod";
export const capitalSchema = z.object({
    id: z.number(),
    currentAmount: z.number(),
    initialAmount: z.number(),
    totalAmount: z.number(),
    initialSetted: z.boolean()
});
//# sourceMappingURL=Capital.js.map