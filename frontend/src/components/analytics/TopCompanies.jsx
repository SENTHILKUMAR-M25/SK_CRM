import { FiHome } from 'react-icons/fi';

export default function TopCompanies({ data }) {
  if (!data || data.length === 0) return null;

  const statusColor = {
    Approved: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    Waiting: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    Rejected: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <FiHome className="w-4 h-4 text-primary-600" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Top Companies</h3>
      </div>
      <div className="space-y-3">
        {data.slice(0, 8).map((c, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{c.companyName.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{c.companyName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{c.totalFollowups} follow-ups</span>
                  {c.latestActivity && (
                    <>
                      <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-xs text-slate-400">{new Date(c.latestActivity).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[c.status] || 'text-slate-600 bg-slate-100'}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
