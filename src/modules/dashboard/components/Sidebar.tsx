import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li
            className={location.pathname === '/dashboard' ? 'active' : ''}
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            Dashboard
          </li>
          <li
            className={location.pathname.startsWith('/doctors') ? 'active' : ''}
            onClick={() => navigate('/doctors')}
            style={{ cursor: 'pointer' }}
          >
            Doctors
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
