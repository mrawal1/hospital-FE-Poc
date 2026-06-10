import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@shared/components/TextField';
import { patientFields } from '../../../schema/patientFields';
import { patientSchema, type PatientFormValues } from '../validations/patient.validation';
import { useCreatePatientMutation } from '../hooks/useCreatePatientMutation';

const genderOptions: { value: PatientFormValues['gender']; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const PatientRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      bloodGroup: '',
    },
  });

  const createPatientMutation = useCreatePatientMutation();

  React.useEffect(() => {
    if (createPatientMutation.isSuccess) {
      reset();
      navigate('/patients');
    }
  }, [createPatientMutation.isSuccess, navigate, reset]);

  const onSubmit = (values: PatientFormValues) => {
    createPatientMutation.mutate(values);
  };

  const serverError = createPatientMutation.isError
    ? isAxiosError(createPatientMutation.error)
      ? (createPatientMutation.error.response?.data?.message ??
        createPatientMutation.error.message)
      : 'Unexpected error. Please try again.'
    : null;

  return (
    <section>
      <h2>Register Patient</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {patientFields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            error={errors[field.name]?.message}
            {...register(field.name)}
          />
        ))}

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="gender" style={{ display: 'block', marginBottom: 4 }}>
            Gender
          </label>
          <select
            id="gender"
            aria-invalid={errors.gender ? true : undefined}
            aria-describedby={errors.gender ? 'gender-error' : undefined}
            style={{ width: '100%', padding: '8px' }}
            {...register('gender')}
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.gender && (
            <span id="gender-error" role="alert" style={{ color: 'red', fontSize: 12 }}>
              {errors.gender.message}
            </span>
          )}
        </div>

        {serverError && (
          <p role="alert" style={{ color: 'red' }}>
            {serverError}
          </p>
        )}

        <button type="submit" disabled={createPatientMutation.isPending}>
          {createPatientMutation.isPending ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </section>
  );
};

export default PatientRegistrationForm;
