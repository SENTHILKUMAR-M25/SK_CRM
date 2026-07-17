import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiSettings, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/leads', label: 'Leads', icon: FiUsers },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/calendar', label: 'Calendar', icon: FiCalendar },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 transition-all duration-300 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <FiBarChart2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-slate-900 dark:text-white">SK CRM</span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
