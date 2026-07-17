import api from './api';

export const analyticsService = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getMonthly: (params) => api.get('/analytics/monthly', { params }),
  getStatus: (params) => api.get('/analytics/status', { params }),
  getFollowups: (params) => api.get('/analytics/followups', { params }),
  getServices: (params) => api.get('/analytics/services', { params }),
  getSources: (params) => api.get('/analytics/sources', { params }),
  getPriorities: (params) => api.get('/analytics/priorities', { params }),
  getTopCompanies: (params) => api.get('/analytics/top-companies', { params }),
  getTeamPerformance: (params) => api.get('/analytics/team-performance', { params }),
  getRecentActivity: (params) => api.get('/analytics/recent-activity', { params }),
  getFilters: () => api.get('/analytics/filters'),
  exportCSV: (params) => api.get('/analytics/export/csv', { params, responseType: 'blob' }),
  exportExcel: (params) => api.get('/analytics/export/excel', { params, responseType: 'blob' }),
};
