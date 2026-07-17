import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import LeadList from './pages/leads/LeadList';
import LeadForm from './pages/leads/LeadForm';
import LeadDetail from './pages/leads/LeadDetail';

function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
        <p className="text-slate-400 mt-2">Coming soon</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<LeadList />} />
        <Route path="leads/create" element={<LeadForm />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="leads/:id/edit" element={<LeadForm />} />
        <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        <Route path="calendar" element={<PlaceholderPage title="Calendar" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
