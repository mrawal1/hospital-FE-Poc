import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  speciality: z.string().min(1, 'Speciality is required'),
  email: z.string().email('Enter a valid email'),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;
