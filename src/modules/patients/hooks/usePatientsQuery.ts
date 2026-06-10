import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../api/patient.api';

export function usePatientsQuery() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatients().then((res) => res.data.data),
  });
}
