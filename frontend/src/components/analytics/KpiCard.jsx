import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const colorMap = {
  primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-700 dark:text-primary-300', icon: 'text-primary-600' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', icon: 'text-emerald-600' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', icon: 'text-red-600' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-300', icon: 'text-violet-600' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-300', icon: 'text-cyan-600' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', icon: 'text-rose-600' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', icon: 'text-orange-600' },
};

export default function KpiCard({ title, value, color = 'primary', icon: Icon, change, format = 'number', prefix = '', suffix = '' }) {
  const colors = colorMap[color] || colorMap.primary;
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const displayValue = format === 'percentage'
    ? `${value}%`
    : format === 'time'
      ? `${value}d`
      : typeof value === 'number'
        ? value.toLocaleString()
        : value || 0;

  return (
    <div className="card-hover relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <p className={`text-2xl font-bold mt-1.5 ${colors.text} transition-all duration-300 group-hover:scale-105 origin-left`}>
            {prefix}{displayValue}{suffix}
          </p>
          {change !== undefined && change !== null && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' :
              isNeutral ? 'text-slate-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? <FiTrendingUp className="w-3 h-3" /> : !isNeutral ? <FiTrendingDown className="w-3 h-3" /> : null}
              <span>{isPositive ? '+' : ''}{change}%</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}
