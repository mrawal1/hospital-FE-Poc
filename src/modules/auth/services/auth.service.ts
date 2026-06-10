import { authApi } from '@modules/auth/api/auth.api';
import { tokenService } from '@shared/services/token-service';
import { useAuthStore } from '@modules/auth/stores/auth.store';
import type { SignupRequest, SignupResponse } from '@modules/auth/types/auth.types';

export const authService = {
  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const { data } = await authApi.signup(payload);
    if (data?.token && data?.user) {
      tokenService.setToken(data.token);
      useAuthStore.getState().login(data.user);
    }
    return data;
  },
};
