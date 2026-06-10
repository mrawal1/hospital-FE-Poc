import React from 'react';
import { Link } from 'react-router-dom';
import { usePatientsQuery } from '../hooks/usePatientsQuery';
import type { Patient } from '../types/patient.types';

const PatientListPage: React.FC = () => {
  const { data: patients, isLoading, isError } = usePatientsQuery();

  return (
    <div style={{ padding: 24 }}>
      <h2>Patients</h2>
      <Link to="/register-patient" style={{ marginBottom: 16, display: 'inline-block' }}>
        Register Patient
      </Link>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Failed to load patients.</div>}
      {!isLoading && !isError && (
        <table
          aria-label="Patients list"
          border={1}
          cellPadding={8}
          cellSpacing={0}
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Blood Group</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(patients) && patients.length > 0 ? (
              patients.map((patient: Patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.dateOfBirth}</td>
                  <td>{patient.bloodGroup ?? '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientListPage;
