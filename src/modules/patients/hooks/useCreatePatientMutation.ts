import { useMutation } from '@tanstack/react-query';
import { createPatient } from '../api/patient.api';
import { queryClient } from '@app/providers/query-client';

export function useCreatePatientMutation() {
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
