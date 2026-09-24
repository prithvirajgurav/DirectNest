import api from './axios'

export const notificationApi = {
  getAll: (params) => api.get('/notifications', { params }),
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}

export default notificationApi
