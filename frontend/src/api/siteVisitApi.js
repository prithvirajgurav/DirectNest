import api from './axios'

export const siteVisitApi = {
  // Customer
  schedule: (data) => api.post('/customer/site-visits', data),
  requestSiteVisit: (data) => api.post('/customer/site-visits', data),
  getMySiteVisits: (params) => api.get('/customer/site-visits', { params }),
  getUserSiteVisits: (params) => api.get('/customer/site-visits', { params }),
  cancelSiteVisit: (id) => api.put(`/customer/site-visits/${id}/cancel`),
  cancel: (id) => api.put(`/customer/site-visits/${id}/cancel`),

  // Builder
  getBuilderSiteVisits: (params) => api.get('/builder/site-visits', { params }),
  updateSiteVisit: (id, data) => api.put(`/builder/site-visits/${id}`, data),
  updateStatus: (id, status, responseNote) =>
    api.put(`/builder/site-visits/${id}`, typeof status === 'object' ? status : { status, responseNote }),
}

export default siteVisitApi
