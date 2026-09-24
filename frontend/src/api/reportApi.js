import api from './axios'

export const reportApi = {
  create: (data) => api.post('/customer/reports', data),
  reportProperty: (data) => api.post('/customer/reports', data),
  getMyReports: (params) => api.get('/customer/reports', { params }),

  // Admin
  getAllReports: (params) => api.get('/admin/reports', { params }),
  updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
}

export default reportApi
