import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiMapPin, FiExternalLink, FiSearch, FiXCircle } from 'react-icons/fi'
import { siteVisitApi } from '../../api/siteVisitApi'
import { toast } from 'react-toastify'

export default function MySiteVisits() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSiteVisits = async () => {
    setLoading(true)
    try {
      const response = await siteVisitApi.getUserSiteVisits({ page: 0, size: 50 })
      const raw = response.data?.data || response.data
      setVisits(raw?.content || (Array.isArray(raw) ? raw : []))
    } catch (error) {
      console.error('Failed to load site visits:', error)
      toast.error('Failed to load scheduled site visits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSiteVisits()
  }, [])

  const handleCancelVisit = async (visitId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled site visit?')) return

    try {
      await siteVisitApi.cancel(visitId)
      toast.info('Site visit cancelled')
      fetchSiteVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel site visit')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmed</span>
      case 'PENDING':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending Confirmation</span>
      case 'COMPLETED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Completed</span>
      case 'CANCELLED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Scheduled Site Visits</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Keep track of all your upcoming and past property visits
          </p>
        </div>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition"
        >
          <FiSearch className="h-4 w-4" />
          Browse Listings
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-28"></div>
          ))}
        </div>
      ) : visits.length > 0 ? (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {visit.property?.title || visit.propertyTitle || `Property #${visit.property?.id || visit.propertyId}`}
                  </h3>
                  {(visit.property?.id || visit.propertyId) && (
                    <Link
                      to={`/properties/${visit.property?.id || visit.propertyId}`}
                      className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      View <FiExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5 font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    <FiCalendar className="h-4 w-4" />
                    {visit.preferredDate ? `${visit.preferredDate} ${visit.preferredTime ? `at ${visit.preferredTime}` : ''}` : (visit.visitDate ? new Date(visit.visitDate).toLocaleString() : 'Scheduled')}
                  </div>

                  {(visit.property?.ownerName || visit.providerName) && (
                    <span className="text-xs text-gray-500">
                      Builder: <strong>{visit.property?.ownerName || visit.providerName}</strong>
                    </span>
                  )}
                </div>

                {(visit.message || visit.notes) && (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg max-w-xl">
                    Request Notes: "{visit.message || visit.notes}"
                  </p>
                )}

                {visit.responseNote && (
                  <p className="text-xs text-indigo-700 bg-indigo-50/70 p-2.5 rounded-lg max-w-xl">
                    Builder Note: "{visit.responseNote}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                {getStatusBadge(visit.status)}

                {(visit.status === 'PENDING' || visit.status === 'CONFIRMED') && (
                  <button
                    onClick={() => handleCancelVisit(visit.id)}
                    className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition inline-flex items-center gap-1"
                  >
                    <FiXCircle className="h-3.5 w-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Scheduled Site Visits</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            Schedule visits directly from any property details page to inspect units in person.
          </p>
          <Link
            to="/properties"
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Explore Properties
          </Link>
        </div>
      )}
    </div>
  )
}
