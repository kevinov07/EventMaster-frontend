
export interface User {
  username: string;
  password: string;
  email: string;
  identifier?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserResponse;
}

