import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadService } from '../../services/leadService';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const defaultForm = {
  companyName: '',
  contactPerson: '',
  contactNumber: '',
  email: '',
  website: '',
  businessAddress: '',
  serviceRequired: '',
  leadSource: 'Website',
  priority: 'Medium',
  status: 'Waiting',
  remark: '',
  nextFollowUpDate: '',
  nextFollowUpTime: '',
};

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchLead = async () => {
        try {
          const res = await leadService.getById(id);
          const lead = res.data.lead;
          setForm({
            companyName: lead.companyName || '',
            contactPerson: lead.contactPerson || '',
            contactNumber: lead.contactNumber || '',
            email: lead.email || '',
            website: lead.website || '',
            businessAddress: lead.businessAddress || '',
            serviceRequired: lead.serviceRequired || '',
            leadSource: lead.leadSource || 'Website',
            priority: lead.priority || 'Medium',
            status: lead.status || 'Waiting',
            remark: lead.remark || '',
            nextFollowUpDate: lead.nextFollowUpDate ? lead.nextFollowUpDate.split('T')[0] : '',
            nextFollowUpTime: lead.nextFollowUpTime || '',
          });
        } catch {
          toast.error('Failed to load lead');
          navigate('/leads');
        } finally {
          setFetching(false);
        }
      };
      fetchLead();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.companyName.trim()) { toast.error('Company name is required'); return false; }
    if (!form.contactPerson.trim()) { toast.error('Contact person is required'); return false; }
    if (!form.contactNumber.trim()) { toast.error('Contact number is required'); return false; }
    if (form.contactNumber.replace(/\D/g, '').length < 10) { toast.error('Invalid phone number'); return false; }
    if (!form.email.trim()) { toast.error('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error('Invalid email format'); return false; }
    if (!form.serviceRequired.trim()) { toast.error('Service required is required'); return false; }
    if (form.status === 'Waiting' && !form.nextFollowUpDate) {
      toast.error('Next follow-up date is required for Waiting status');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        ...form,
        nextFollowUpDate: form.status === 'Waiting' && form.nextFollowUpDate ? form.nextFollowUpDate : undefined,
        nextFollowUpTime: form.status === 'Waiting' && form.nextFollowUpTime ? form.nextFollowUpTime : undefined,
      };

      if (isEdit) {
        await leadService.update(id, data);
        toast.success('Lead updated successfully');
      } else {
        await leadService.create(data);
        toast.success('Lead created successfully');
      }
      navigate('/leads');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 skeleton" />
        <div className="card"><div className="grid grid-cols-2 gap-4"><div className="h-10 skeleton col-span-2" /><div className="h-10 skeleton" /><div className="h-10 skeleton" /></div></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/leads')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{isEdit ? 'Update lead information' : 'Enter new lead details'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Company Name *</label>
              <input type="text" name="companyName" value={form.companyName} onChange={handleChange} className="input" placeholder="Enter company name" />
            </div>
            <div>
              <label className="label">Contact Person *</label>
              <input type="text" name="contactPerson" value={form.contactPerson} onChange={handleChange} className="input" placeholder="Full name" />
            </div>
            <div>
              <label className="label">Contact Number *</label>
              <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} className="input" placeholder="Phone number" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="email@company.com" />
            </div>
            <div>
              <label className="label">Website</label>
              <input type="url" name="website" value={form.website} onChange={handleChange} className="input" placeholder="https://example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Business Address</label>
              <textarea name="businessAddress" value={form.businessAddress} onChange={handleChange} className="input min-h-[60px] resize-none" placeholder="Full address" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Service & Source</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Service Required *</label>
              <input type="text" name="serviceRequired" value={form.serviceRequired} onChange={handleChange} className="input" placeholder="e.g., Web Development" />
            </div>
            <div>
              <label className="label">Lead Source</label>
              <select name="leadSource" value={form.leadSource} onChange={handleChange} className="select">
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="select">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="select">
                <option value="Waiting">Waiting</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Remark & Follow-up</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Remark</label>
              <textarea name="remark" value={form.remark} onChange={handleChange} className="input min-h-[80px] resize-none" placeholder="Initial remarks about this lead..." />
            </div>

            {form.status === 'Waiting' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                <div>
                  <label className="label text-amber-800 dark:text-amber-300">Next Follow-up Date *</label>
                  <input type="date" name="nextFollowUpDate" value={form.nextFollowUpDate} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label text-amber-800 dark:text-amber-300">Next Follow-up Time</label>
                  <input type="time" name="nextFollowUpTime" value={form.nextFollowUpTime} onChange={handleChange} className="input" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/leads')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            <FiSave className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
