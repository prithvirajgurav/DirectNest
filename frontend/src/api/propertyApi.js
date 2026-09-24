import api from './axios'

export const propertyApi = {
  // Public
  search: (params) => api.get('/properties', { params }),
  searchProperties: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  getProperty: (id) => api.get(`/properties/${id}`),
  getFeaturedProperties: () => api.get('/properties/featured'),

  // Builder
  getMyProperties: (params) => api.get('/builder/properties', { params }),
  getMyProperty: (id) => api.get(`/builder/properties/${id}`),
  createProperty: (data) => api.post('/builder/properties', data),
  updateProperty: (id, data) => api.put(`/builder/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/builder/properties/${id}`),
  submitProperty: (id) => api.post(`/builder/properties/${id}/submit`),
  submitPropertyForReview: (id) => api.post(`/builder/properties/${id}/submit`),

  // Images
  uploadImages: (propertyId, formData) =>
    api.post(`/builder/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadPropertyImage: (propertyId, formData) =>
    api.post(`/builder/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteImage: (propertyId, imageId) =>
    api.delete(`/builder/properties/${propertyId}/images/${imageId}`),
  deletePropertyImage: (propertyId, imageId) =>
    api.delete(`/builder/properties/${propertyId}/images/${imageId}`),
  setPrimaryImage: (propertyId, imageId) =>
    api.put(`/builder/properties/${propertyId}/images/${imageId}/primary`),

  // Documents
  uploadDocument: (propertyId, formData) =>
    api.post(`/builder/properties/${propertyId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadPropertyDocument: (propertyId, formData) =>
    api.post(`/builder/properties/${propertyId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteDocument: (propertyId, documentId) =>
    api.delete(`/builder/properties/${propertyId}/documents/${documentId}`),
  deletePropertyDocument: (propertyId, documentId) =>
    api.delete(`/builder/properties/${propertyId}/documents/${documentId}`),

  // Admin
  getPendingProperties: (params) => api.get('/admin/properties/pending', { params }),
  approveProperty: (id) => api.put(`/admin/properties/${id}/approve`),
  rejectProperty: (id, data) => api.put(`/admin/properties/${id}/reject`, data),
  getAllProperties: (params) => api.get('/admin/properties', { params }),
}

export default propertyApi
