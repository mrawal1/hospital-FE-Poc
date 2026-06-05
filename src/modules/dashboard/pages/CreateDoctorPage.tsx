import React from 'react';
import DoctorProfileForm from '../components/DoctorProfileForm';

const CreateDoctorPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Create Doctor</h2>
      <DoctorProfileForm />
    </div>
  );
};

export default CreateDoctorPage;
