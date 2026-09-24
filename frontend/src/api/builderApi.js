import api from './axios'

export const builderApi = {
  // Provider Profile
  getMyProfile: () => api.get('/builder/profile'),
  getProfile: () => api.get('/builder/profile'),
  createProfile: (data) => api.post('/builder/profile', data),
  updateProfile: (data) => api.put('/builder/profile', data),
  uploadProfileImage: (formData) =>
    api.post('/builder/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Verification & Documents
  getMyVerification: () => api.get('/builder/profile'),
  getDocuments: () => api.get('/builder/documents'),
  submitVerification: (data) => api.post('/builder/verification', data),
  uploadDocument: (formData) =>
    api.post('/builder/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadVerificationDocument: (formData) =>
    api.post('/builder/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteDocument: (id) => api.delete(`/builder/documents/${id}`),

  // Properties management
  getMyProperties: (params) => api.get('/builder/properties', { params }),
  getMyProperty: (id) => api.get(`/builder/properties/${id}`),
  createProperty: (data) => api.post('/builder/properties', data),
  updateProperty: (id, data) => api.put(`/builder/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/builder/properties/${id}`),
  submitProperty: (id) => api.post(`/builder/properties/${id}/submit`),
  submitPropertyForReview: (id) => api.post(`/builder/properties/${id}/submit`),

  // Property Media & Docs
  uploadPropertyImage: (propertyId, formData) =>
    api.post(`/builder/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePropertyImage: (propertyId, imageId) =>
    api.delete(`/builder/properties/${propertyId}/images/${imageId}`),
  setPrimaryImage: (propertyId, imageId) =>
    api.put(`/builder/properties/${propertyId}/images/${imageId}/primary`),
  uploadPropertyDocument: (propertyId, formData) =>
    api.post(`/builder/properties/${propertyId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePropertyDocument: (propertyId, documentId) =>
    api.delete(`/builder/properties/${propertyId}/documents/${documentId}`),

  // Enquiries & Site Visits
  getEnquiries: (params) => api.get('/builder/enquiries', { params }),
  respondToEnquiry: (id, data) => api.put(`/builder/enquiries/${id}`, data),
  getSiteVisits: (params) => api.get('/builder/site-visits', { params }),
  updateSiteVisitStatus: (id, status) => api.put(`/builder/site-visits/${id}`, { status }),

  // Public provider profile
  getProviderProfile: (id) => api.get(`/providers/${id}`),
  getPublicProvider: (id) => api.get(`/providers/${id}`),
  getProviderProperties: (id, params) => api.get(`/providers/${id}/properties`, { params }),

  // Admin
  getPendingVerifications: (params) => api.get('/admin/builders/pending', { params }),
  approveBuilder: (id) => api.put(`/admin/builders/${id}/approve`),
  rejectBuilder: (id, data) => api.put(`/admin/builders/${id}/reject`, data),
  getAllProviders: (params) => api.get('/admin/builders', { params }),
}

export default builderApi
