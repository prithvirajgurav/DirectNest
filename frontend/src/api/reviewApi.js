import api from './axios'

export const reviewApi = {
  create: (data) => api.post('/customer/reviews', data),
  createReview: (data) => api.post('/customer/reviews', data),
  getByProperty: (propertyId, params) => api.get(`/properties/${propertyId}/reviews`, { params }),
  getPropertyReviews: (propertyId, params) => api.get(`/properties/${propertyId}/reviews`, { params }),
  getSummary: (propertyId) => api.get(`/properties/${propertyId}/reviews`),
  getPropertySummary: (propertyId) => api.get(`/properties/${propertyId}/reviews`),
  getProviderReviews: (providerId, params) => api.get(`/providers/${providerId}/reviews`, { params }),
  getMyReviews: (params) => api.get('/customer/reviews', { params }),
  updateReview: (id, data) => api.put(`/customer/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/customer/reviews/${id}`),
}

export default reviewApi
