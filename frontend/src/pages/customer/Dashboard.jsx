import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiMail, FiCalendar, FiBell, FiSearch, FiArrowRight, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import favoriteApi from '../../api/favoriteApi'
import enquiryApi from '../../api/enquiryApi'
import siteVisitApi from '../../api/siteVisitApi'
import notificationApi from '../../api/notificationApi'
import PropertyCard from '../../components/property/PropertyCard'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    favoritesCount: 0,
    enquiriesCount: 0,
    siteVisitsCount: 0,
    unreadNotifications: 0
  })
  const [recentFavorites, setRecentFavorites] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [recentVisits, setRecentVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [favsRes, enqRes, visRes, notifRes] = await Promise.allSettled([
          favoriteApi.getUserFavorites({ page: 0, size: 3 }),
          enquiryApi.getUserEnquiries({ page: 0, size: 4 }),
          siteVisitApi.getUserSiteVisits({ page: 0, size: 4 }),
          notificationApi.getUnreadCount()
        ])

        const favsRaw = favsRes.status === 'fulfilled' ? (favsRes.value.data?.data || favsRes.value.data) : { content: [], totalElements: 0 }
        const enqsRaw = enqRes.status === 'fulfilled' ? (enqRes.value.data?.data || enqRes.value.data) : { content: [], totalElements: 0 }
        const visitsRaw = visRes.status === 'fulfilled' ? (visRes.value.data?.data || visRes.value.data) : { content: [], totalElements: 0 }
        const unreadRaw = notifRes.status === 'fulfilled' ? (notifRes.value.data?.data ?? notifRes.value.data) : 0

        const favsContent = favsRaw?.content || (Array.isArray(favsRaw) ? favsRaw : [])
        const enqsContent = enqsRaw?.content || (Array.isArray(enqsRaw) ? enqsRaw : [])
        const visitsContent = visitsRaw?.content || (Array.isArray(visitsRaw) ? visitsRaw : [])
        const unreadCount = typeof unreadRaw === 'object' && unreadRaw !== null ? (unreadRaw.unreadCount ?? 0) : (typeof unreadRaw === 'number' ? unreadRaw : 0)

        setStats({
          favoritesCount: favsRaw?.totalElements ?? favsContent.length,
          enquiriesCount: enqsRaw?.totalElements ?? enqsContent.length,
          siteVisitsCount: visitsRaw?.totalElements ?? visitsContent.length,
          unreadNotifications: unreadCount
        })

        setRecentFavorites(favsContent.slice(0, 3))
        setRecentEnquiries(enqsContent.slice(0, 4))
        setRecentVisits(visitsContent.slice(0, 4))
      } catch (err) {
        console.error('Failed to load customer dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome back, {user?.fullName || 'Buyer'}!
          </h1>
          <p className="text-indigo-100 text-sm mt-1">
            Track your saved properties, direct builder enquiries, and scheduled site visits.
          </p>
        </div>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 shadow transition"
        >
          <FiSearch className="h-4 w-4" />
          Explore Properties
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/customer/favorites"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FiHeart className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.favoritesCount}</div>
            <div className="text-xs text-gray-500 font-medium">Saved Properties</div>
          </div>
        </Link>

        <Link
          to="/customer/enquiries"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiMail className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.enquiriesCount}</div>
            <div className="text-xs text-gray-500 font-medium">Active Enquiries</div>
          </div>
        </Link>

        <Link
          to="/customer/site-visits"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCalendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.siteVisitsCount}</div>
            <div className="text-xs text-gray-500 font-medium">Site Visits</div>
          </div>
        </Link>

        <Link
          to="/customer/notifications"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiBell className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.unreadNotifications}</div>
            <div className="text-xs text-gray-500 font-medium">Unread Alerts</div>
          </div>
        </Link>
      </div>

      {/* Recent Activity: Enquiries & Site Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Direct Enquiries</h2>
            <Link to="/customer/enquiries" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {enq.property?.title || enq.propertyTitle || `Property #${enq.propertyId}`}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{enq.message}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
                    enq.status === 'RESPONDED' ? 'bg-emerald-50 text-emerald-700' :
                    enq.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center">No enquiries sent yet.</p>
          )}
        </div>

        {/* Recent Site Visits */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Site Visits</h2>
            <Link to="/customer/site-visits" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {recentVisits.length > 0 ? (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {visit.property?.title || visit.propertyTitle || `Property #${visit.propertyId}`}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📅 {visit.preferredDate ? `${visit.preferredDate} at ${visit.preferredTime || ''}` : (visit.visitDate ? new Date(visit.visitDate).toLocaleString() : 'Scheduled')}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
                    visit.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' :
                    visit.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                    visit.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center">No site visits scheduled.</p>
          )}
        </div>
      </div>
    </div>
  )
}
