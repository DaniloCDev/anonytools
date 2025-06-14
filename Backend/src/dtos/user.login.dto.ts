export interface UserLoginDTO
{
    email: string;
    password: string;
}

import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;