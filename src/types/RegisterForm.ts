import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string({
    required_error: "Nome é obrigatório",
  }),
  email: z.string({
    required_error: "E-mail é obrigatório"
  }).min(13, "E-mail deve ter pelo menos 13 caracteres"),
  password: z.string({
    required_error: "Senha é obrigatória"
  }).min(9, "Senha deve ter pelo menos 9 caracteres"),
  confirmPassword: z.string({
    required_error: "Confirmação de senha é obrigatória"
  }).min(9, "Confirmação de senha deve ter pelo menos 9 caracteres"),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "As senhas não são iguais",
      path: ["confirmPassword"]
    });
  }

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const hasNumber = numbers.some(n => {
    return password.includes(n);
  });

  if (!hasNumber) {
    ctx.addIssue({
      code: "custom",
      message: "Sua senha não possui caracteres numéricos, o que a torna fraca. Por favor, revise-a.",
      path: ["password"]
    });
  }

  // o alfabeto maiusculo na tabela UTF-16 começa a partir do elemento 65, cujo código também é 65
  let upperAlphabet: string[] = [...Array(26).keys()].map(i => String.fromCharCode(i + 65));

  const hasUpperLetter = upperAlphabet.some(l => {
    return password.includes(l);
  });

  if (!hasUpperLetter) {
    ctx.addIssue({
      code: "custom",
      message: "Sua senha não possui caracteres maiúsculos, o que a torna fraca. Por favor, revise-a.",
      path: ["password"]
    });
  }

  const specialChars = ["!", "@", "#", "$", "%", "&", "*", "-", "+", "="];

  const hasSpecialChar = specialChars.some(c => {
    return password.includes(c);
  });

  if (!hasSpecialChar) {
    ctx.addIssue({
      code: "custom",
      message: "Sua senha não possui caracteres especiais, o que a torna fraca. Por favor, revise-a.",
      path: ["password"]
    });
  }
});
