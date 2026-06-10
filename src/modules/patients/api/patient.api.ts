import apiClient from '@lib/http/client';
import type { PatientFormValues } from '../validations/patient.validation';
import type { Patient } from '../types/patient.types';

export const getPatients = () =>
  apiClient.get<{ data: Patient[] }>('/patient/patientList');

export const createPatient = (payload: PatientFormValues) =>
  apiClient.post<{ data: Patient }>('/patient/createPatient', payload);
