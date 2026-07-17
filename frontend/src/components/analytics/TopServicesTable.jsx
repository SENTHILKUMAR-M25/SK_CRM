import { FiLayers } from 'react-icons/fi';

export default function TopServicesTable({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <FiLayers className="w-4 h-4 text-primary-600" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Top Performing Services</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approved</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waiting</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rejected</th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conv. %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {data.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">{s.service}</td>
                <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">{s.total}</td>
                <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">{s.approved}</td>
                <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400">{s.waiting}</td>
                <td className="py-2.5 px-3 text-right text-red-600 dark:text-red-400">{s.rejected}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    s.conversionRate >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                    s.conversionRate >= 40 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {s.conversionRate}%
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
