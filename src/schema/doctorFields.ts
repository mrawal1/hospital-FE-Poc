export interface DoctorFieldConfig {
  name: 'name' | 'speciality' | 'email';
  label: string;
  type: string;
  placeholder: string;
}

export const doctorFields: DoctorFieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: "Enter doctor's name",
  },
  {
    name: 'speciality',
    label: 'Speciality',
    type: 'text',
    placeholder: 'Enter speciality',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email',
  },
];
