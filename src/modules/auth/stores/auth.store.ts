// Create a Zustand store for authentication
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthUser } from '@modules/auth/types/auth.types';
import { tokenService } from '@shared/services/token-service';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
  user: null,
  token: tokenService.getToken(),

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
  }),
  {
    name: 'auth-store',
    // Only persist the user object — token is already managed by tokenService in localStorage
    partialize: (state) => ({ user: state.user }),
  }
));