import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from '../common/Loader';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Navbar collapsed={collapsed} onToggleSidebar={() => setCollapsed(!collapsed)} />
      <main className={`pt-16 transition-all duration-300 min-h-screen ${
        collapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
