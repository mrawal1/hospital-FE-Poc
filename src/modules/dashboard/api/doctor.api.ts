export const getDoctors = () => apiClient.get('/doctor/doctorList');
import apiClient from '@lib/http/client';

export const createDoctor = (payload: any) =>
  apiClient.post('/doctor/createDoctor', payload);
