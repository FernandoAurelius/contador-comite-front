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
//# sourceMappingURL=Meta.js.map