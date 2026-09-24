import { useState, useEffect } from 'react'
import { FiBell } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import notificationApi from '../../api/notificationApi'

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount()
      const data = res.data?.data
      const count = typeof data === 'object' && data !== null ? (data.unreadCount ?? 0) : (typeof data === 'number' ? data : 0)
      setUnreadCount(count)
    } catch {
      // silently fail
    }
  }

  const handleClick = () => {
    const path = user?.role === 'CUSTOMER' ? '/customer/notifications'
      : user?.role === 'BUILDER' ? '/builder/notifications'
      : '/admin/dashboard'
    navigate(path)
  }

  return (
    <button onClick={handleClick} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Notifications">
      <FiBell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
