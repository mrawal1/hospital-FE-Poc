import { useMutation } from '@tanstack/react-query';
import { createDoctor } from '../api/doctor.api';
import { queryClient } from '@app/providers/query-client';

export function useCreateDoctorMutation() {
  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}
