import type { PatientFormValues } from '@modules/patients/validations/patient.validation';

export interface PatientFieldConfig {
  name: keyof PatientFormValues;
  label: string;
  type: string;
  placeholder: string;
}

export const patientFields: PatientFieldConfig[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: "Enter patient's full name",
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email address',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter phone number',
  },
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    placeholder: '',
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'Enter home address',
  },
  {
    name: 'bloodGroup',
    label: 'Blood Group',
    type: 'text',
    placeholder: 'e.g. A+, O-, B+',
  },
];
