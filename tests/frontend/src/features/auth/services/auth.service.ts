import { api } from '@/lib/api';
import type { LoginFormData, RegisterFormData } from '../schemas';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const { confirmPassword, ...registerData } = data;
    const response = await api.post<AuthResponse>('/auth/register', registerData);
    return response.data;
  },
};
