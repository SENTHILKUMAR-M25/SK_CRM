import { useState } from 'react';
import Modal from '../common/Modal';
import { leadService } from '../../services/leadService';
import toast from 'react-hot-toast';

export default function FollowUpModal({ lead, isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    followUpDate: new Date().toISOString().split('T')[0],
    followUpTime: new Date().toTimeString().slice(0, 5),
    status: 'Follow-up',
    remark: '',
    nextFollowUpDate: '',
    nextFollowUpTime: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.remark || !form.followUpDate) {
      toast.error('Remark and date are required');
      return;
    }

    setLoading(true);
    try {
      const data = { ...form };
      if (!data.nextFollowUpDate) {
        data.nextFollowUpDate = undefined;
        data.nextFollowUpTime = undefined;
      }
      await leadService.addFollowUp(lead._id, data);
      toast.success('Follow-up added successfully');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add follow-up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Follow-up: ${lead.companyName}`} size="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Date *</label>
            <input type="date" value={form.followUpDate} onChange={(e) => setForm(prev => ({ ...prev, followUpDate: e.target.value }))} className="input" required />
          </div>
          <div>
            <label className="label">Time</label>
            <input type="time" value={form.followUpTime} onChange={(e) => setForm(prev => ({ ...prev, followUpTime: e.target.value }))} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Status</label>
          <select value={form.status} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))} className="select">
            <option value="Called">Called</option>
            <option value="Emailed">Emailed</option>
            <option value="Meeting">Meeting</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Closed">Closed</option>
            <option value="Waiting">Waiting</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="label">Remark *</label>
          <textarea
            value={form.remark}
            onChange={(e) => setForm(prev => ({ ...prev, remark: e.target.value }))}
            className="input min-h-[80px] resize-none"
            placeholder="Enter follow-up details..."
            required
          />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Next Follow-up (optional)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input type="date" value={form.nextFollowUpDate} onChange={(e) => setForm(prev => ({ ...prev, nextFollowUpDate: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" value={form.nextFollowUpTime} onChange={(e) => setForm(prev => ({ ...prev, nextFollowUpTime: e.target.value }))} className="input" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Add Follow-up'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
