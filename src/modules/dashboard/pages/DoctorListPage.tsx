import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctorsQuery } from '../hooks/useDoctorsQuery';

const DoctorListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: doctorsData, isLoading, isError } = useDoctorsQuery();
  const doctors = doctorsData?.data;

  console.log('Doctors data:', doctors);

  return (
    <div style={{ padding: 24 }}>
      <h2>Doctors</h2>
      <button style={{ marginBottom: 16 }} onClick={() => navigate('/create-doctor')}>
        Create Doctor
      </button>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Failed to load doctors.</div>}
      {!isLoading && !isError && (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Speciality</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doc: any) => (
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
