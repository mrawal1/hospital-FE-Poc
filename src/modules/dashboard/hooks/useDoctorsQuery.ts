import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '../api/doctor.api';

export function useDoctorsQuery() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data } = await getDoctors();
      return data;
    },
    staleTime: 0,
  });
}
