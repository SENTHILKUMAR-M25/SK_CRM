import { useRef } from 'react';
import { FiSearch, FiRotateCcw, FiCalendar } from 'react-icons/fi';

export default function FilterBar({ filters, users, onFilterChange, onRefresh, loading }) {
  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ dateFrom: '', dateTo: '', status: '', service: '', source: '', priority: '', assignedTo: '' });
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiSearch className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters</span>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-primary-600 dark:text-primary-400 hover:underline ml-2">
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <span className="text-xs text-slate-400">
              Filtering results
            </span>
          )}
          <button onClick={onRefresh} disabled={loading} className="btn-secondary btn-sm">
            <FiRotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date From</label>
          <div className="relative">
            <input
              ref={dateFromRef}
              type="date"
              value={filters.dateFrom}
              onChange={e => handleChange('dateFrom', e.target.value)}
              className="input text-xs pl-8"
            />
            <FiCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date To</label>
          <div className="relative">
            <input
              ref={dateToRef}
              type="date"
              value={filters.dateTo}
              onChange={e => handleChange('dateTo', e.target.value)}
              className="input text-xs pl-8"
            />
            <FiCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
          <select value={filters.status} onChange={e => handleChange('status', e.target.value)} className="select text-xs">
            <option value="">All Status</option>
            <option value="Waiting">Waiting</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Service</label>
          <select value={filters.service} onChange={e => handleChange('service', e.target.value)} className="select text-xs">
            <option value="">All Services</option>
            {(users?.services || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Source</label>
          <select value={filters.source} onChange={e => handleChange('source', e.target.value)} className="select text-xs">
            <option value="">All Sources</option>
            {(users?.sources || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Priority</label>
          <select value={filters.priority} onChange={e => handleChange('priority', e.target.value)} className="select text-xs">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">User</label>
          <select value={filters.assignedTo} onChange={e => handleChange('assignedTo', e.target.value)} className="select text-xs">
            <option value="">All Users</option>
            {(users?.users || []).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
