export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  data: any;
  token: string;
  username: string;
  user: User;
}

export interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Users {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}
