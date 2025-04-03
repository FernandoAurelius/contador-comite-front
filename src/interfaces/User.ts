import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "user"]),
});

type User = z.infer<typeof userSchema>;

export default User;
