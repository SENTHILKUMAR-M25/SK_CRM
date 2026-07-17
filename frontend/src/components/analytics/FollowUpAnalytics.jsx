import { FiCheckCircle, FiClock, FiAlertTriangle, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import FollowUpTrendChart from './FollowUpTrendChart';

const cards = [
  { key: 'completedToday', label: 'Completed Today', color: 'emerald', icon: FiCheckCircle },
  { key: 'pendingToday', label: 'Pending Today', color: 'amber', icon: FiClock },
  { key: 'overdue', label: 'Overdue', color: 'red', icon: FiAlertTriangle },
  { key: 'upcoming', label: 'Upcoming', color: 'blue', icon: FiCalendar },
  { key: 'completionRate', label: 'Completion Rate', color: 'violet', icon: FiTrendingUp, suffix: '%' },
];

const colorMap = {
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  violet: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20',
};

export default function FollowUpAnalytics({ data }) {
  if (!data) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Follow-up Analytics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {cards.map(({ key, label, color, icon: Icon, suffix }) => (
          <div key={key} className="card-hover">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                <p className={`text-xl font-bold ${colorMap[color].split(' ')[0]}`}>
                  {data[key] ?? 0}{suffix || ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FollowUpTrendChart data={data} />
    </div>
  );
}
