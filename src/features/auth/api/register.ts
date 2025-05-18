import { api } from '@/lib/api';
import { RegisterInput, AuthResponse } from '../types';

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}; 