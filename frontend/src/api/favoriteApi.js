import api from './axios'

export const favoriteApi = {
  addFavorite: (propertyId) => api.post(`/customer/favorites/${propertyId}`),
  removeFavorite: (propertyId) => api.delete(`/customer/favorites/${propertyId}`),
  getFavorites: (params) => api.get('/customer/favorites', { params }),
  getUserFavorites: (params) => api.get('/customer/favorites', { params }),
  checkFavorite: (propertyId) => api.get(`/customer/favorites/${propertyId}/check`),
}

export default favoriteApi
