import { timeAgo } from '../../utils/formatters';

const actionIcons = {
  'Lead Created': '🟢',
  'Lead Updated': '🔵',
  'Follow-up Added': '🟡',
  'Document Uploaded': '📎',
};

export default function RecentActivities({ activities }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activities</h3>
      <div className="space-y-1">
        {activities.map((activity) => (
          <div key={activity._id} className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm flex-shrink-0">
              {activity.user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-medium">{activity.user?.name || 'System'}</span>
                {' '}{activity.description}
              </p>
              {activity.lead && (
                <p className="text-xs text-slate-400 mt-0.5">{activity.lead.companyName}</p>
              )}
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
              {timeAgo(activity.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
