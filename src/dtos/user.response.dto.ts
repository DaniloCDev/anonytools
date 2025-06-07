
export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserLoginResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}
