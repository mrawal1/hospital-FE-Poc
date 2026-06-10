import React from 'react';
import PatientRegistrationForm from '../components/PatientRegistrationForm';

const RegisterPatientPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Register Patient</h2>
      <PatientRegistrationForm />
    </div>
  );
};

export default RegisterPatientPage;
