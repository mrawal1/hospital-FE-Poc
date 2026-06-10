import React from 'react';
import { Link } from 'react-router-dom';
import { useDoctorsQuery } from '../hooks/useDoctorsQuery';
import type { Doctor } from '../types/doctor.types';

const DoctorListPage: React.FC = () => {
  const { data: doctorsData, isLoading, isError } = useDoctorsQuery();
  const doctors = doctorsData?.data as Doctor[] | undefined;

  return (
    <div style={{ padding: 24 }}>
      <h2>Doctors</h2>
      <Link to="/create-doctor" style={{ marginBottom: 16, display: 'inline-block' }}>Create Doctor</Link>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Failed to load doctors.</div>}
      {!isLoading && !isError && (
        <table aria-label="Doctors list" border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Speciality</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.speciality}</td>
                  <td>{doc.email}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3}>No doctors found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorListPage;
