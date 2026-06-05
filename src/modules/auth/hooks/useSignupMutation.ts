import { useMutation } from '@tanstack/react-query';
import { authService } from '@modules/auth/services/auth.service';
import type { SignupRequest, SignupResponse } from '@modules/auth/types/auth.types';

export const useSignupMutation = () =>
  useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: (payload) => authService.signup(payload),
  });
