import axios from 'axios';
import { attachAuthInterceptors } from '@middlewares/axios-interceptor';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachAuthInterceptors(apiClient);

export default apiClient;
