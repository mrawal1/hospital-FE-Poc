import type { AxiosInstance } from 'axios';
import { tokenService } from '@shared/services/token-service';
import { showGlobalToast } from '@/shared/components/Toaster/Toast';

/**
 * Attaches common request/response interceptors to an axios instance.
 * - Adds Bearer token to every request when available.
 * - Clears token and redirects to /login on 401 responses.
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
      // Optionally show success toast for certain endpoints
      if (response.config.method !== 'get' && response.data?.message) {
        showGlobalToast(response.data.message, 'success');
      }
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        tokenService.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      // Show error toast for API errors
      const msg = error?.response?.data?.message || error.message || 'Unexpected error';
      showGlobalToast(msg, 'error');
      return Promise.reject(error);
    },
  );

  return client;
};
