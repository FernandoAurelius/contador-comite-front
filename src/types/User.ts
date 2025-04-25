import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string(),
  role: z.enum(["ADMIN", "USER"]),
});

type User = z.infer<typeof userSchema>;

export default User;
