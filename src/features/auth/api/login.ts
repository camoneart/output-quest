import { api } from '@/lib/api';
import { LoginInput, AuthResponse } from '../types';

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}; 