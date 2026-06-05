import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import '../pages/DashboardPage.css';

const DashboardLayout = () => (
  <div className="dashboard-container">
    <Sidebar />
    <main className="dashboard-main">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
