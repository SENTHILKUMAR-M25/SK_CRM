import { FiUsers, FiClock, FiCheck, FiX, FiCalendar, FiAlertTriangle } from 'react-icons/fi';

const iconMap = {
  users: FiUsers,
  clock: FiClock,
  check: FiCheck,
  x: FiX,
  calendar: FiCalendar,
  alert: FiAlertTriangle,
};

const colorMap = {
  primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-700 dark:text-primary-300', icon: 'text-primary-600' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', icon: 'text-emerald-600' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', icon: 'text-red-600' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600' },
};

export default function StatCard({ title, value, color = 'primary', icon = 'users', subtitle, highlight }) {
  const Icon = iconMap[icon];
  const colors = colorMap[color];

  return (
    <div className={`card-hover ${highlight ? 'ring-2 ring-red-400 dark:ring-red-500 animate-pulse' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
