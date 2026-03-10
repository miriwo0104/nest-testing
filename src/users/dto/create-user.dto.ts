import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export type User = CreateUserDto & { id: string } // Intersection（交差）型