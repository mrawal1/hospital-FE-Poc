
import { useMutation } from '@tanstack/react-query';
import { login } from '@modules/auth/api/auth.api';
import { tokenService } from '@shared/services/token-service';
import type { LoginResponse } from '@modules/auth/types/auth.types';

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (payload: import('@modules/auth/types/auth.types').LoginRequest) => {
      const { data } = await login(payload);
      if (data?.token) {
        tokenService.setToken(data.token);
      }
      return data as LoginResponse;
    },
  });
}
