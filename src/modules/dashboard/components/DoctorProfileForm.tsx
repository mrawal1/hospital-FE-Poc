
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@shared/components/TextField';
import { doctorFields } from '../../../schema/doctorFields';
import { doctorSchema, type DoctorFormValues } from '../validations/doctor.validation';
import { useCreateDoctorMutation } from '../hooks/useCreateDoctorMutation';
import './DoctorProfileForm.css';

const DoctorProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: { name: '', speciality: '', email: '' },
  });

  const createDoctorMutation = useCreateDoctorMutation();

  React.useEffect(() => {
    if (createDoctorMutation.isSuccess) {
      reset();
      navigate('/doctors');
    }
  }, [createDoctorMutation.isSuccess, navigate, reset]);

  const onSubmit = (values: DoctorFormValues) => {
    createDoctorMutation.mutate(values);
  };

  const serverError = createDoctorMutation.isError
    ? isAxiosError(createDoctorMutation.error)
      ? (createDoctorMutation.error.response?.data?.message ??
        createDoctorMutation.error.message)
      : 'Unexpected error. Please try again.'
    : null;

  return (
    <section className="doctor-profile-form">
      <h2>Doctor Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {doctorFields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            error={errors[field.name]?.message}
            {...register(field.name)}
          />
        ))}
        {serverError && (
          <p role="alert" style={{ color: 'red' }}>{serverError}</p>
        )}
        <button type="submit" disabled={createDoctorMutation.isPending}>
          {createDoctorMutation.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  );
};

export default DoctorProfileForm;
