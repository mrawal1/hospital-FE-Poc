import { useMutation } from '@tanstack/react-query';
import { createDoctor } from '../api/doctor.api';

export function useCreateDoctorMutation() {
  return useMutation({
    mutationFn: createDoctor,
  });
}
