import { FiPlus, FiRefreshCw, FiCheck, FiX, FiMessageSquare, FiClock } from 'react-icons/fi';
import { timeAgo } from '../../utils/formatters';

const actionConfig = {
  'Lead Created': { icon: FiPlus, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
  'Lead Updated': { icon: FiRefreshCw, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  'Follow-up Added': { icon: FiClock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  'Lead Approved': { icon: FiCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  'Lead Rejected': { icon: FiX, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  'Remark Added': { icon: FiMessageSquare, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
};

export default function RecentActivityTimeline({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="space-y-0">
          {data.slice(0, 15).map((activity, i) => {
            const config = actionConfig[activity.action] || { icon: FiRefreshCw, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700' };
            const Icon = config.icon;
            return (
              <div key={activity.id || i} className="relative flex items-start gap-4 pb-4 last:pb-0 group">
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color} transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{activity.user?.name || 'System'}</span>
                    {' '}{activity.description}
                  </p>
                  {activity.lead && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {activity.lead.companyName}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0 pt-1.5">
                  {timeAgo(activity.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
