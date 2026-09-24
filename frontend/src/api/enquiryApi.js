import api from './axios'

export const enquiryApi = {
  // Customer
  create: (data) => api.post('/customer/enquiries', data),
  createEnquiry: (data) => api.post('/customer/enquiries', data),
  getMyEnquiries: (params) => api.get('/customer/enquiries', { params }),
  getUserEnquiries: (params) => api.get('/customer/enquiries', { params }),

  // Builder
  getBuilderEnquiries: (params) => api.get('/builder/enquiries', { params }),
  respondToEnquiry: (id, data) => api.put(`/builder/enquiries/${id}/respond`, data),
  respond: (id, data) => api.put(`/builder/enquiries/${id}/respond`, data),
}

export default enquiryApi
