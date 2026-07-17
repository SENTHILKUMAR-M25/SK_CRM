import { FiUsers } from 'react-icons/fi';

export default function TeamPerformance({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <FiUsers className="w-4 h-4 text-primary-600" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Team Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Closed</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conv. %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {data.map((t, i) => (
              <tr key={t.userId || i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                      {t.name.charAt(0)}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{t.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">{t.assignedLeads}</td>
                <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">{t.closedLeads}</td>
                <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400">{t.pendingLeads}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.conversionRate >= 50 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                    t.conversionRate >= 25 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {t.conversionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
