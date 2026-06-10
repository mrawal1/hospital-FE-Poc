import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctors"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Doctors
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
