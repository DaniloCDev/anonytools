
export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserLoginResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
