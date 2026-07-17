import api from './api';

export const leadService = {
  getAll: (params) => api.get('/leads', { params }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  getHistory: (id) => api.get(`/leads/${id}/history`),
  addFollowUp: (id, data) => api.post(`/leads/${id}/history`, data),
  uploadDocument: (id, formData) => api.post(`/leads/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteDocument: (id, docId) => api.delete(`/leads/${id}/documents/${docId}`),
  getFilters: () => api.get('/leads/filters'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const exportService = {
  csv: (params) => api.get('/export/csv', { params, responseType: 'blob' }),
  excel: (params) => api.get('/export/excel', { params, responseType: 'blob' }),
};
