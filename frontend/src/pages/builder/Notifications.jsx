import { useState, useEffect } from 'react'
import { FiBell, FiCheck, FiClock, FiCheckCircle } from 'react-icons/fi'
import { notificationApi } from '../../api/notificationApi'
import { toast } from 'react-toastify'

export default function BuilderNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await notificationApi.getAll({ page: 0, size: 50 })
      const raw = response.data?.data || response.data
      setNotifications(raw?.content || (Array.isArray(raw) ? raw : []))
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Builder Alerts & Activity</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `You have ${unreadCount} unread alert(s)` : 'No unread alerts'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition self-start sm:self-auto"
          >
            <FiCheckCircle className="h-4 w-4" /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse h-20"></div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-2xl p-5 border transition flex items-start justify-between gap-4 ${
                notif.read ? 'border-gray-100 opacity-80' : 'border-indigo-100 bg-indigo-50/20 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.read ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-600 font-bold'
                  }`}
                >
                  <FiBell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-sm ${notif.read ? 'font-semibold text-gray-800' : 'font-bold text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                  <span className="text-[11px] text-gray-400 mt-2 block flex items-center gap-1">
                    <FiClock className="h-3 w-3" /> {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg shrink-0 transition"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiBell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Alerts</h3>
          <p className="text-sm text-gray-500 mt-1">You do not have any alerts at the moment.</p>
        </div>
      )}
    </div>
  )
}
