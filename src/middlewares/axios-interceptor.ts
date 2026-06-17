import type { AxiosInstance } from 'axios';
import { tokenService } from '@shared/services/token-service';
import { showGlobalToast } from '@/shared/components/Toaster/Toast';
import { useAuthStore } from '@modules/auth/stores/auth.store';
import { router } from '@app/router/AppRouter';

/**
 * Attaches common request/response interceptors to an axios instance.
 * - Adds Bearer token to every request when available.
 * - On 401: clears auth state and navigates to /login via the router
 *   singleton (no hard page reload).
 */
export const attachAuthInterceptors = (client: AxiosInstance): AxiosInstance => {
  client.interceptors.request.use((config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      if (response.config.method !== 'get' && response.data?.message) {
        showGlobalToast(response.data.message, 'success');
      }
      return response;
    },
    (error) => {
      const isLoginEndpoint = error.config?.url?.includes('/auth/login');
      if (error?.response?.status === 401 && !isLoginEndpoint) {
        useAuthStore.getState().logout();
        router.navigate('/login', { replace: true });
      }
      const msg = error?.response?.data?.message || error.message || 'Unexpected error';
      showGlobalToast(msg, 'error');
      return Promise.reject(error);
    }
  );

  return client;
};
