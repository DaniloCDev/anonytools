import { User } from "@prisma/client";
import { UserResponseDTO } from "../../../auth/dtos/user.response.dto";

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}