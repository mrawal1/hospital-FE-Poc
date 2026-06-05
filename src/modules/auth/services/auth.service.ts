import { authApi } from '@modules/auth/api/auth.api';
import { tokenService } from '@shared/services/token-service';
import type { SignupRequest, SignupResponse } from '@modules/auth/types/auth.types';

export const authService = {
  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const { data } = await authApi.signup(payload);
    if (data?.token) {
      tokenService.setToken(data.token);
    }
    return data;
  },
};
