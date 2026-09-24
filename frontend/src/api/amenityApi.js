import api from './axios'

export const amenityApi = {
  getAll: () => api.get('/amenities'),
  getAllAmenities: () => api.get('/amenities'),
}

export default amenityApi
