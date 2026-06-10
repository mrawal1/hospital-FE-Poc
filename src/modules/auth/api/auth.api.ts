import apiClient from '@lib/http/client';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '@modules/auth/types/auth.types';

export const authApi = {
  signup: (payload: SignupRequest) =>
    apiClient.post<SignupResponse>('/auth/signup', payload),
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', payload),
};
