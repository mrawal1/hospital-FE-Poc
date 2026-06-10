import apiClient from '@lib/http/client';
import type { DoctorFormValues } from '../validations/doctor.validation';
import type { Doctor } from '../types/doctor.types';

export const getDoctors = () => apiClient.get<{ data: Doctor[] }>('/doctor/doctorList');

export const createDoctor = (payload: DoctorFormValues) =>
  apiClient.post('/doctor/createDoctor', payload);
