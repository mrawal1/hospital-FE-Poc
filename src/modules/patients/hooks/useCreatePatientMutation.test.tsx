import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCreatePatientMutation } from './useCreatePatientMutation';
import * as patientApi from '../api/patient.api';
import type { Patient } from '../types/patient.types';

vi.mock('../api/patient.api');

const validPayload = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+1234567890',
  dateOfBirth: '1990-05-15',
  gender: 'female' as const,
  address: '123 Main St',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCreatePatientMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createPatient API with the provided payload', async () => {
    const mockPatient: Patient = { id: 1, ...validPayload, bloodGroup: undefined };
    vi.mocked(patientApi.createPatient).mockResolvedValue({ data: { data: mockPatient } } as any);

    const { result } = renderHook(() => useCreatePatientMutation(), { wrapper });
    result.current.mutate(validPayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(patientApi.createPatient).toHaveBeenCalledTimes(1);
  });

  it('transitions to error state when the API call fails', async () => {
    vi.mocked(patientApi.createPatient).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCreatePatientMutation(), { wrapper });
    result.current.mutate(validPayload);
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
