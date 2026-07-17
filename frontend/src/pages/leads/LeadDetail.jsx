import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { leadService } from '../../services/leadService';
import { FiArrowLeft, FiEdit2, FiTrash2, FiCalendar, FiDownload, FiClock, FiPhone, FiMail, FiGlobe, FiMapPin, FiUser, FiFileText } from 'react-icons/fi';
import { formatDate, formatTime, timeAgo } from '../../utils/formatters';
import FollowUpModal from '../../components/leads/FollowUpModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const statusBadge = { Waiting: 'badge-waiting', Approved: 'badge-approved', Rejected: 'badge-rejected' };
const priorityBadge = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await leadService.getById(id);
        setLead(res.data.lead);
        setFollowUps(res.data.followUps);
        setActivities(res.data.activities);
      } catch {
        toast.error('Failed to load lead');
        navigate('/leads');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await leadService.delete(id);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await leadService.uploadDocument(id, formData);
      setLead(res.data.lead);
      toast.success('Document uploaded');
      setShowUploadModal(false);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      const res = await leadService.deleteDocument(id, docId);
      setLead(res.data.lead);
      toast.success('Document removed');
    } catch {
      toast.error('Failed to delete document');
    }
  };

  const handleFollowUpSuccess = async () => {
    try {
      const res = await leadService.getById(id);
      setLead(res.data.lead);
      setFollowUps(res.data.followUps);
      setActivities(res.data.activities);
    } catch {
      // silent
    }
  };

  if (loading) return <Loader />;
  if (!lead) return null;

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5 break-words">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/leads')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lead.companyName}</h1>
              <span className={statusBadge[lead.status]}>{lead.status}</span>
              <span className={priorityBadge[lead.priority]}>{lead.priority}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Created {formatDate(lead.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/leads/${id}/edit`} className="btn-secondary btn-sm">
            <FiEdit2 className="w-3.5 h-3.5" /> Edit
          </Link>
          <button onClick={() => setShowDelete(true)} className="btn-danger btn-sm">
            <FiTrash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Company Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <InfoRow icon={FiUser} label="Contact Person" value={lead.contactPerson} />
              <InfoRow icon={FiPhone} label="Contact Number" value={lead.contactNumber} />
              <InfoRow icon={FiMail} label="Email" value={lead.email} />
              <InfoRow icon={FiGlobe} label="Website" value={lead.website} />
              <InfoRow icon={FiMapPin} label="Business Address" value={lead.businessAddress} />
              <InfoRow icon={FiFileText} label="Service Required" value={lead.serviceRequired} />
              <InfoRow icon={FiCalendar} label="Lead Source" value={lead.leadSource} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Follow-up History</h2>
              <button onClick={() => setShowFollowUp(true)} className="btn-primary btn-sm">
                <FiCalendar className="w-3.5 h-3.5" /> Add Follow-up
              </button>
            </div>
            {followUps.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No follow-up history yet</div>
            ) : (
              <div className="space-y-4">
                {followUps.map((f, i) => (
                  <div key={f._id} className="relative pl-8 pb-4 border-l-2 border-slate-200 dark:border-slate-700 last:pb-0">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-slate-800" />
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-primary-600">
                          {formatDate(f.followUpDate)} {f.followUpTime && <span>at {formatTime(f.followUpTime)}</span>}
                        </span>
                        <span className="text-xs text-slate-400">{timeAgo(f.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs">{f.status}</span>
                        {f.createdBy?.name && <span className="text-xs text-slate-400">by {f.createdBy.name}</span>}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{f.remark}</p>
                      {f.nextFollowUpDate && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                          <FiClock className="w-3 h-3" />
                          Next: {formatDate(f.nextFollowUpDate)} {f.nextFollowUpTime && formatTime(f.nextFollowUpTime)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Current Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Status</p>
                <p className="mt-1"><span className={statusBadge[lead.status]}>{lead.status}</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Priority</p>
                <p className="mt-1"><span className={priorityBadge[lead.priority]}>{lead.priority}</span></p>
              </div>
              {lead.nextFollowUpDate && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Next Follow-up</p>
                  <p className="mt-1 text-sm font-medium text-amber-600">
                    {formatDate(lead.nextFollowUpDate)}
                    {lead.nextFollowUpTime && <span> {formatTime(lead.nextFollowUpTime)}</span>}
                  </p>
                </div>
              )}
              {lead.remark && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Latest Remark</p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">{lead.remark}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Documents</h2>
              <button onClick={() => setShowUploadModal(true)} className="btn-secondary btn-sm">
                <FiDownload className="w-3.5 h-3.5" /> Upload
              </button>
            </div>
            {(!lead.documents || lead.documents.length === 0) ? (
              <div className="text-center py-6 text-slate-400 text-sm">No documents uploaded</div>
            ) : (
              <div className="space-y-2">
                {lead.documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <FiFileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{doc.fileName}</span>
                    </div>
                    <button onClick={() => handleDeleteDoc(doc._id)} className="text-xs text-red-500 hover:text-red-700 flex-shrink-0">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">No recent activity</div>
            ) : (
              <div className="space-y-2">
                {activities.slice(0, 10).map((a) => (
                  <div key={a._id} className="flex items-start gap-2 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-600 dark:text-slate-400">{a.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(a.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FollowUpModal
        lead={lead}
        isOpen={showFollowUp}
        onClose={() => setShowFollowUp(false)}
        onSuccess={handleFollowUpSuccess}
      />

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete ${lead.companyName}? This cannot be undone.`}
      />

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Document" size="max-w-sm">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
            <FiFileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Upload PDF, images, or documents</p>
            <label className="btn-primary cursor-pointer">
              <FiDownload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Choose File'}
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt" />
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
