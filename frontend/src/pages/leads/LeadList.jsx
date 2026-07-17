import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiDownload, FiFilter, FiX } from 'react-icons/fi';
import { useLeads } from '../../hooks/useLeads';
import LeadTable from '../../components/leads/LeadTable';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import { exportService } from '../../services/leadService';
import toast from 'react-hot-toast';

export default function LeadList() {
  const { leads, pagination, loading, params, setParams, fetchLeads } = useLeads({ page: 1, limit: 10, sort: '-createdAt' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '', priority: '', service: '', leadSource: '', dateFrom: '', dateTo: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilter = () => {
    const activeFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) activeFilters[key] = value;
    });
    setParams(prev => ({ ...prev, ...activeFilters, page: 1 }));
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', service: '', leadSource: '', dateFrom: '', dateTo: '' });
    setParams({ page: 1, limit: 10, sort: '-createdAt' });
  };

  const handleExport = async (format) => {
    try {
      const res = await exportService[format](params);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error('Export failed');
    }
  };

  const filterCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your leads and follow-ups</p>
        </div>
        <Link to="/leads/create" className="btn-primary">
          <FiPlus className="w-4 h-4" /> Add Lead
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, contact, email or phone..."
            className="input pl-10 pr-10"
          />
          {searchTerm && (
            <button type="button" onClick={() => { setSearchTerm(''); setParams(prev => { const { search, ...rest } = prev; return rest; }); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <FiX className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </form>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary relative">
            <FiFilter className="w-4 h-4" /> Filters
            {filterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>
          <div className="relative group">
            <button className="btn-secondary">
              <FiDownload className="w-4 h-4" /> Export
            </button>
            <div className="absolute right-0 top-10 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-xl">CSV</button>
              <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-b-xl">Excel</button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="card animate-slide-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Status</label>
              <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="select">
                <option value="">All Statuses</option>
                <option value="Waiting">Waiting</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select value={filters.priority} onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))} className="select">
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="label">Service</label>
              <input type="text" value={filters.service} onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))} className="input" placeholder="Filter by service" />
            </div>
            <div>
              <label className="label">Lead Source</label>
              <select value={filters.leadSource} onChange={(e) => setFilters(prev => ({ ...prev, leadSource: e.target.value }))} className="select">
                <option value="">All Sources</option>
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
              <label className="label">Date From</label>
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Date To</label>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))} className="input" />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button onClick={clearFilters} className="btn-secondary">Clear All</button>
            <button onClick={handleFilter} className="btn-primary">Apply Filters</button>
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={searchTerm || filterCount > 0 ? 'Try adjusting your search or filters.' : 'Start by adding your first lead.'}
          action={<Link to="/leads/create" className="btn-primary"><FiPlus className="w-4 h-4" /> Add Lead</Link>}
        />
      ) : (
        <>
          <LeadTable leads={leads} onDelete={() => fetchLeads()} />
          <Pagination pagination={pagination} onPageChange={(page) => setParams(prev => ({ ...prev, page }))} />
        </>
      )}
    </div>
  );
}
