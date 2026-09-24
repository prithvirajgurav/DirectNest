import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiCheck, FiX, FiCheckCircle, FiExternalLink } from 'react-icons/fi'
import { builderApi } from '../../api/builderApi'
import { toast } from 'react-toastify'

export default function BuilderSiteVisits() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const response = await builderApi.getSiteVisits({ page: 0, size: 50 })
      const raw = response.data?.data || response.data
      setVisits(raw?.content || (Array.isArray(raw) ? raw : []))
    } catch (error) {
      console.error('Failed to load site visits:', error)
      toast.error('Failed to load site visits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
  }, [])

  const handleUpdateStatus = async (visitId, newStatus) => {
    try {
      await builderApi.updateSiteVisitStatus(visitId, newStatus)
      toast.success(`Site visit marked as ${newStatus}`)
      fetchVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update site visit')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmed</span>
      case 'PENDING':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
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
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Buyer Site Visit Appointments</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage scheduled in-person inspections for your listings
        </p>
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
                    {visit.customer?.fullName || visit.customerName || 'Buyer Appointment'}
                  </h3>
                  {getStatusBadge(visit.status)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <FiCalendar /> {visit.preferredDate ? `${visit.preferredDate} at ${visit.preferredTime || ''}` : (visit.visitDate ? new Date(visit.visitDate).toLocaleString() : 'Requested')}
                  </span>
                  {(visit.customer?.phone || visit.customerPhone) && <span>📞 {visit.customer?.phone || visit.customerPhone}</span>}
                  {(visit.customer?.email || visit.customerEmail) && <span>✉️ {visit.customer?.email || visit.customerEmail}</span>}
                  {(visit.property?.title || visit.propertyTitle) && (
                    <span>Listing: <strong>{visit.property?.title || visit.propertyTitle}</strong></span>
                  )}
                </div>

                {(visit.message || visit.notes) && (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg max-w-xl">
                    Buyer Note: "{visit.message || visit.notes}"
                  </p>
                )}

                {visit.responseNote && (
                  <p className="text-xs text-indigo-700 bg-indigo-50/70 p-2.5 rounded-lg max-w-xl">
                    Response Note: "{visit.responseNote}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {visit.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(visit.id, 'CONFIRMED')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1"
                    >
                      <FiCheck className="h-3.5 w-3.5" /> Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(visit.id, 'CANCELLED')}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition inline-flex items-center gap-1"
                    >
                      <FiX className="h-3.5 w-3.5" /> Decline
                    </button>
                  </>
                )}

                {visit.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(visit.id, 'COMPLETED')}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1"
                  >
                    <FiCheckCircle className="h-3.5 w-3.5" /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Site Visits Scheduled</h3>
          <p className="text-sm text-gray-500 mt-1">
            When buyers book in-person visits to your properties, they will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
