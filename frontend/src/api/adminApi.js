import api from './axios'

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  getProviders: (params) => api.get('/admin/providers', { params }),
  getVerifications: (params) => api.get('/admin/verifications', { params }),
  approveVerification: (id) => api.put(`/admin/verifications/${id}/approve`),
  rejectVerification: (id, reason) => api.put(`/admin/verifications/${id}/reject`, { reason }),
  getProperties: (params) => api.get('/admin/properties', { params }),
  getPropertyForReview: (id) => api.get(`/admin/properties/${id}/review`),
  approveProperty: (id) => api.put(`/admin/properties/${id}/approve`),
  rejectProperty: (id, reason) => api.put(`/admin/properties/${id}/reject`, { reason }),
  getReports: (params) => api.get('/admin/reports', { params }),
  resolveReport: (id, data) => api.put(`/admin/reports/${id}`, data),
}

export default adminApi
