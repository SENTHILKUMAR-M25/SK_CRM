import { useState, useCallback, useRef } from 'react';
import {
  FiBarChart2, FiDownload, FiPrinter, FiRefreshCw,
  FiUsers, FiUserPlus, FiCheckCircle, FiClock, FiXCircle,
  FiTrendingUp, FiMessageCircle, FiCalendar, FiAlertTriangle, FiZap
} from 'react-icons/fi';
import { useAnalytics } from '../../hooks/useAnalytics';
import KpiCard from '../../components/analytics/KpiCard';
import FilterBar from '../../components/analytics/FilterBar';
import LeadStatusPieChart from '../../components/analytics/LeadStatusPieChart';
import MonthlyLeadLineChart from '../../components/analytics/MonthlyLeadLineChart';
import MonthlyConversionBarChart from '../../components/analytics/MonthlyConversionBarChart';
import LeadSourcesBarChart from '../../components/analytics/LeadSourcesBarChart';
import ServicesHorizontalBar from '../../components/analytics/ServicesHorizontalBar';
import PriorityPieChart from '../../components/analytics/PriorityPieChart';
import FollowUpAnalytics from '../../components/analytics/FollowUpAnalytics';
import TopServicesTable from '../../components/analytics/TopServicesTable';
import RecentActivityTimeline from '../../components/analytics/RecentActivityTimeline';
import TopCompanies from '../../components/analytics/TopCompanies';
import TeamPerformance from '../../components/analytics/TeamPerformance';
import SkeletonLoader from '../../components/analytics/SkeletonLoader';
import { analyticsService } from '../../services/analyticsService';

const today = new Date().toISOString().split('T')[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

const kpiConfig = [
  { key: 'totalLeads', label: 'Total Leads', color: 'primary', icon: FiUsers, changeKey: 'totalLeads' },
  { key: 'newLeads', label: 'New Leads', color: 'blue', icon: FiUserPlus, changeKey: 'newLeads' },
  { key: 'approvedLeads', label: 'Approved Leads', color: 'emerald', icon: FiCheckCircle, changeKey: 'approvedLeads' },
  { key: 'waitingLeads', label: 'Waiting Leads', color: 'amber', icon: FiClock, changeKey: 'waitingLeads' },
  { key: 'rejectedLeads', label: 'Rejected Leads', color: 'red', icon: FiXCircle, changeKey: 'rejectedLeads' },
  { key: 'conversionRate', label: 'Conversion Rate', color: 'violet', icon: FiTrendingUp, changeKey: 'conversionRate', format: 'percentage' },
  { key: 'totalFollowups', label: 'Total Follow-ups', color: 'cyan', icon: FiMessageCircle, changeKey: 'totalFollowups' },
  { key: 'todayFollowups', label: "Today's Follow-ups", color: 'orange', icon: FiCalendar, changeKey: 'todayFollowups' },
  { key: 'overdueFollowups', label: 'Overdue Follow-ups', color: 'rose', icon: FiAlertTriangle, changeKey: 'overdueFollowups' },
  { key: 'avgResponseTime', label: 'Avg Response Time', color: 'emerald', icon: FiZap, changeKey: 'avgResponseTime', format: 'time' },
];

export default function AnalyticsDashboard() {
  const [filters, setFilters] = useState({
    dateFrom: '', dateTo: '',
    status: '', service: '', source: '', priority: '', assignedTo: ''
  });
  const [showExportMenu, setShowExportMenu] = useState(false);
  const printRef = useRef(null);
  const exportRef = useRef(null);

  const { data, loading, error, refresh } = useAnalytics(filters);
  const overview = data?.overview;
  const changes = overview?.changes || {};

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = async (format) => {
    setShowExportMenu(false);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });

      if (format === 'csv') {
        const res = await analyticsService.exportCSV(params);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url; a.download = `analytics-${today}.csv`; a.click();
        window.URL.revokeObjectURL(url);
      } else if (format === 'excel') {
        const res = await analyticsService.exportExcel(params);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url; a.download = `analytics-${today}.xlsx`; a.click();
        window.URL.revokeObjectURL(url);
      } else if (format === 'print') {
        window.print();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" ref={printRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiBarChart2 className="w-6 h-6 text-primary-600" />
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Comprehensive insights into your sales pipeline and team performance
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn-secondary btn-sm"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Export
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1 animate-scale-in">
                  <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    Export as CSV
                  </button>
                  <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    Export as Excel
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-700" />
                  <button onClick={() => handleExport('print')} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <FiPrinter className="w-3.5 h-3.5 inline mr-2" />
                    Print Report
                  </button>
                </div>
              </>
            )}
          </div>
          <button onClick={refresh} disabled={loading} className="btn-primary btn-sm">
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <FilterBar
        filters={filters}
        users={data?.filters}
        onFilterChange={handleFilterChange}
        onRefresh={refresh}
        loading={loading}
      />

      {loading ? <SkeletonLoader /> : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpiConfig.map(({ key, label, color, icon, changeKey, format }) => (
              <KpiCard
                key={key}
                title={label}
                value={overview?.[key]}
                color={color}
                icon={icon}
                change={changes[changeKey]}
                format={format}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadStatusPieChart data={data?.status} />
            <MonthlyLeadLineChart data={data?.monthly} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyConversionBarChart data={data?.monthly} />
            <LeadSourcesBarChart data={data?.sources} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ServicesHorizontalBar data={data?.services} />
            <PriorityPieChart data={data?.priorities} />
          </div>

          <FollowUpAnalytics data={data?.followups} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopServicesTable data={data?.services} />
            <TopCompanies data={data?.topCompanies} />
          </div>

          {data?.teamPerformance && data.teamPerformance.length > 0 && (
            <TeamPerformance data={data?.teamPerformance} />
          )}

          <RecentActivityTimeline data={data?.recentActivity} />
        </>
      )}
    </div>
  );
}
