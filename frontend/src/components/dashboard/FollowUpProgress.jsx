export default function FollowUpProgress({ today, overdue, upcoming, total }) {
  if (total === 0) return null;

  const todayPct = total > 0 ? (today / total) * 100 : 0;
  const overduePct = total > 0 ? (overdue / total) * 100 : 0;
  const upcomingPct = total > 0 ? (upcoming / total) * 100 : 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Follow-up Progress</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Today</span>
            <span className="font-medium text-primary-600">{today}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${todayPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Overdue</span>
            <span className="font-medium text-red-600">{overdue}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${overduePct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Upcoming</span>
            <span className="font-medium text-emerald-600">{upcoming}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${upcomingPct}%` }} />
          </div>
        </div>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Total Waiting</span>
            <span className="font-bold text-slate-900 dark:text-white">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
