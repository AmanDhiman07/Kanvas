export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

