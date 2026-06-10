
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@modules/auth/api/auth.api';
import { tokenService } from '@shared/services/token-service';
import { useAuthStore } from '@modules/auth/stores/auth.store';
import type { LoginRequest, LoginResponse } from '@modules/auth/types/auth.types';

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await authApi.login(payload);
      if (data?.token && data?.user) {
        tokenService.setToken(data.token);
        useAuthStore.getState().login(data.user);
      }
      return data as LoginResponse;
    },
  });
}
