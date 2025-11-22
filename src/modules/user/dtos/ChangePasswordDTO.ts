// src/dtos/ChangePasswordDTO.ts
import { z } from "zod"

export const changePasswordSchema = z.object({
  lastPassword: z.string().min(6, "Senha atual muito curta"),
  newPassword: z.string().min(6, "Nova senha muito curta"),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>
