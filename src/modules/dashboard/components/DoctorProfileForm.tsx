
import React, { useState } from 'react';
import TextField from '@shared/components/TextField';
import { doctorFields } from '../../../schema/doctorFields';
import { useCreateDoctorMutation } from '../hooks/useCreateDoctorMutation';
import './DoctorProfileForm.css';


const DoctorProfileForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', speciality: '', email: '' });
  const createDoctorMutation = useCreateDoctorMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDoctorMutation.mutate(form);
  };

  return (
    <section className="doctor-profile-form">
      <h2>Doctor Profile</h2>
      <form onSubmit={handleSubmit}>
        {doctorFields.map((field: any) => (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={form && typeof form === 'object' && field.name in form ? (form as any)[field.name] : ''}
            onChange={handleChange}
          />
        ))}
        <button type="submit" disabled={createDoctorMutation.isPending}>
          {createDoctorMutation.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {createDoctorMutation.isSuccess && <p style={{color: 'green'}}>Doctor profile created!</p>}
      {createDoctorMutation.isError && <p style={{color: 'red'}}>Error creating doctor profile.</p>}
    </section>
  );
};

export default DoctorProfileForm;
