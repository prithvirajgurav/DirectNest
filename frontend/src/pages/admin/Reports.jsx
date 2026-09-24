import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiFlag, FiCheckCircle, FiXCircle, FiExternalLink,
  FiAlertTriangle, FiEye, FiClock, FiMessageSquare
} from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [resolvingId, setResolvingId] = useState(null)
  const [actionNotes, setActionNotes] = useState('')

  const fetchReports = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getReports({
        page: 0,
        size: 50,
        status: statusFilter || undefined
      })
      const data = response.data?.data || response.data
      setReports(data?.content || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to load abuse reports:', error)
      toast.error('Failed to load moderation reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [statusFilter])

  const handleResolve = async (e, id, resolutionStatus) => {
    e.preventDefault()
    try {
      await adminApi.resolveReport(id, {
        status: resolutionStatus,
        adminNotes: actionNotes
      })
      toast.success(`Report marked as ${resolutionStatus.toLowerCase()}`)
      setResolvingId(null)
      setActionNotes('')
      fetchReports()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update report status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Listing Abuse & Fraud Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review community flags regarding incorrect pricing, fake listings, broker violations, or suspicious activity
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { label: 'Pending Review', value: 'PENDING' },
          { label: 'Resolved Reports', value: 'RESOLVED' },
          { label: 'Dismissed', value: 'DISMISSED' },
          { label: 'All Reports', value: '' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading abuse reports...</div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
                      {r.reason || 'Flagged Listing'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Reported {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    Property: {r.property?.title || `Listing #${r.propertyId}`}
                  </h3>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span>Reporter: <strong>{r.user?.fullName || r.user?.email || 'Anonymous Buyer'}</strong></span>
                    {r.property?.locality && <span>• Location: <strong>{r.property.locality}, {r.property.city}</strong></span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(r.property?.id || r.propertyId) && (
                    <Link
                      to={`/admin/properties/${r.property?.id || r.propertyId}/review`}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                    >
                      <FiEye className="h-3.5 w-3.5" /> Inspect Property
                    </Link>
                  )}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    r.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    r.status === 'DISMISSED' ? 'bg-gray-100 text-gray-700' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>

              {/* Report Description */}
              <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-700">
                <span className="font-bold text-gray-900 block mb-1">User's Statement / Complaint:</span>
                <p className="whitespace-pre-line">{r.description || 'No additional comments provided by reporter.'}</p>
              </div>

              {/* Admin Action Taken / Notes if resolved */}
              {r.adminNotes && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
                  <span className="font-bold block mb-0.5">Admin Moderation Resolution Note:</span>
                  {r.adminNotes}
                </div>
              )}

              {/* Resolution Form */}
              {r.status === 'PENDING' && (
                resolvingId === r.id ? (
                  <form className="pt-3 border-t border-gray-100 space-y-3">
                    <label className="block text-xs font-bold text-gray-700">Resolution or Dismissal Notes</label>
                    <textarea
                      rows={2}
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="e.g. Contacted builder, corrected price / False flag confirmed with RERA registry..."
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleResolve(e, r.id, 'RESOLVED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Resolve & Mark Action Taken
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleResolve(e, r.id, 'DISMISSED')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition"
                      >
                        Dismiss Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolvingId(null)}
                        className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setResolvingId(r.id)
                        setActionNotes('')
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                    >
                      Process Report
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiCheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Abuse Reports</h3>
          <p className="text-sm text-gray-500 mt-1">There are no listing reports matching this filter.</p>
        </div>
      )}
    </div>
  )
}
