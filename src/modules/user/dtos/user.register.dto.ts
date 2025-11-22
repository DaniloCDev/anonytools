export interface UseRegisterDTO
{
    name: string;
    email: string;
    password: string;
}

import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;