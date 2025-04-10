import { z } from "zod";
export const loginFormSchema = z.object({
    email: z.string({
        required_error: "Nome é obrigatório",
    }),
    password: z.string({
        required_error: "E-mail é obrigatório"
    })
});
//# sourceMappingURL=LoginForm.js.map