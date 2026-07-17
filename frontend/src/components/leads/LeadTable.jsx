import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { leadService } from '../../services/leadService';
import { formatDate, formatTime, isOverdue, isToday } from '../../utils/formatters';
import ConfirmDialog from '../common/ConfirmDialog';
import FollowUpModal from './FollowUpModal';
import toast from 'react-hot-toast';

const priorityBadge = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
const statusBadge = { Waiting: 'badge-waiting', Approved: 'badge-approved', Rejected: 'badge-rejected' };

export default function LeadTable({ leads, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);
  const [followUpLead, setFollowUpLead] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await leadService.delete(deleteId);
      toast.success('Lead deleted');
      onDelete();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3.5 font-medium">Company</th>
                <th className="px-4 py-3.5 font-medium">Contact Person</th>
                <th className="px-4 py-3.5 font-medium">Mobile</th>
                <th className="px-4 py-3.5 font-medium">Service</th>
                <th className="px-4 py-3.5 font-medium">Priority</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-4 py-3.5 font-medium">Next Follow-up</th>
                <th className="px-4 py-3.5 font-medium">Last Updated</th>
                <th className="px-4 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <Link to={`/leads/${lead._id}`} className="font-medium text-slate-900 dark:text-white hover:text-primary-600">
                      {lead.companyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{lead.contactPerson}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">{lead.contactNumber}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 max-w-[150px] truncate">{lead.serviceRequired}</td>
                  <td className="px-4 py-3.5"><span className={priorityBadge[lead.priority]}>{lead.priority}</span></td>
                  <td className="px-4 py-3.5"><span className={statusBadge[lead.status]}>{lead.status}</span></td>
                  <td className="px-4 py-3.5">
                    {lead.nextFollowUpDate ? (
                      <span className={`text-xs whitespace-nowrap ${isOverdue(lead.nextFollowUpDate) ? 'text-red-600 font-semibold' : isToday(lead.nextFollowUpDate) ? 'text-primary-600 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatDate(lead.nextFollowUpDate)}
                        {lead.nextFollowUpTime && <span className="ml-1">{formatTime(lead.nextFollowUpTime)}</span>}
                        {isOverdue(lead.nextFollowUpDate) && <span className="ml-1">(Overdue)</span>}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{formatDate(lead.updatedAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setFollowUpLead(lead)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-600 transition-colors" title="Add Follow-up">
                        <FiMessageSquare className="w-4 h-4" />
                      </button>
                      <Link to={`/leads/${lead._id}`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-600 transition-colors" title="View">
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link to={`/leads/${lead._id}/edit`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-600 transition-colors" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(lead._id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? All follow-up history will also be removed."
      />

      {followUpLead && (
        <FollowUpModal
          lead={followUpLead}
          isOpen={!!followUpLead}
          onClose={() => setFollowUpLead(null)}
          onSuccess={onDelete}
        />
      )}
    </>
  );
}
