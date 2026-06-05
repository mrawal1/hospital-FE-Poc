// Create a Zustand store for authentication
import { create } from 'zustand';
import type { AuthState, AuthUser } from '@modules/auth/types/auth.types';
import { tokenService } from '@shared/services/token-service';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: tokenService.getToken(),
  loading: false,
  error: null,

  login: (user: AuthUser) =>
    set({
      user,
      token: tokenService.getToken(),
    }),

  logout: () => {
    tokenService.removeToken();
    set({
      user: null,
      token: null,
    });
  },
}));