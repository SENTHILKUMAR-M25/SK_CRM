import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { formatDate, formatTime } from '../../utils/formatters';

const statusBadge = {
  Waiting: 'badge-waiting',
  Approved: 'badge-approved',
  Rejected: 'badge-rejected',
};

export default function RecentLeads({ leads }) {
  if (!leads || leads.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Leads</h3>
        <Link to="/leads" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View All <FiArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Contact</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Next Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 5).map((lead) => (
              <tr key={lead._id} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3">
                  <Link to={`/leads/${lead._id}`} className="font-medium text-slate-900 dark:text-white hover:text-primary-600">
                    {lead.companyName}
                  </Link>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400">{lead.contactPerson}</td>
                <td className="py-3">
                  <span className={statusBadge[lead.status]}>{lead.status}</span>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400 text-xs">
                  {lead.nextFollowUpDate ? (
                    <>{formatDate(lead.nextFollowUpDate)} {lead.nextFollowUpTime && formatTime(lead.nextFollowUpTime)}</>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
