import { axiosClient } from '../../api/axiosClient';
import { z } from 'zod';

// Define Zod schemas for type safety and validation
export const LoginSchema = z.object({
  username: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().optional(),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // FastAPI expects form-data for OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await axiosClient.post<AuthResponse>('/auth/login/access-token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await axiosClient.post<User>('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosClient.get<User>('/auth/me');
    return response.data;
  },
};
