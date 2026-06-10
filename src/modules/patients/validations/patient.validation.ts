import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender' }),
  address: z.string().min(1, 'Address is required'),
  bloodGroup: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
