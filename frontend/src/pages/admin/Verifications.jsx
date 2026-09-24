import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShield, FiCheckCircle, FiXCircle, FiFile, FiClock, FiExternalLink } from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchVerifications = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getVerifications({ page: 0, size: 50, status: 'PENDING_VERIFICATION' })
      const data = response.data?.data || response.data
      setVerifications(data?.content || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to load verifications:', error)
      toast.error('Failed to load verification queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVerifications()
  }, [])

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this builder profile and grant verified partner status?')) return

    try {
      await adminApi.approveVerification(id)
      toast.success('Builder profile verified successfully!')
      fetchVerifications()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve verification')
    }
  }

  const handleReject = async (e, id) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason')
      return
    }

    try {
      await adminApi.rejectVerification(id, rejectReason)
      toast.info('Verification rejected')
      setRejectingId(null)
      setRejectReason('')
      fetchVerifications()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject verification')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Builder Verification Queue</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review business registration, RERA credentials, and grant verified status to developers
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-40"></div>
          ))}
        </div>
      ) : verifications.length > 0 ? (
        <div className="space-y-6">
          {verifications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.businessName || item.user?.fullName}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>Email: <strong>{item.user?.email}</strong></span>
                    {item.user?.phone && <span>• Phone: <strong>{item.user?.phone}</strong></span>}
                    {item.city && <span>• Location: <strong>{item.city}, {item.state}</strong></span>}
                  </div>
                </div>

                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold self-start sm:self-auto">
                  Awaiting Verification
                </span>
              </div>

              {/* Details & Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-gray-50 p-4 rounded-xl">
                <div>
                  <span className="text-gray-400 block uppercase font-bold text-[10px]">Partner Type</span>
                  <span className="font-semibold text-gray-800 text-sm">{item.providerType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase font-bold text-[10px]">RERA Number</span>
                  <span className="font-mono font-semibold text-indigo-600 text-sm">{item.reraNumber || 'Not Provided'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase font-bold text-[10px]">Experience</span>
                  <span className="font-semibold text-gray-800 text-sm">{item.experienceYears || 0} Years</span>
                </div>
              </div>

              {/* Attached Verification Documents */}
              {item.documents && item.documents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                    Submitted Credentials & Files ({item.documents.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.documents.map((doc) => (
                      <div key={doc.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FiFile className="text-indigo-600 shrink-0" />
                          <span className="font-semibold text-gray-800 truncate">{doc.documentType}</span>
                        </div>
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-indigo-600 hover:underline shrink-0 flex items-center gap-1"
                        >
                          View <FiExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {rejectingId === item.id ? (
                <form onSubmit={(e) => handleReject(e, item.id)} className="space-y-3 pt-3 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700">Reason for Rejection</label>
                  <textarea
                    rows={2}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Specify what credentials or certificates are missing..."
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
                  >
                    <FiCheckCircle className="h-4 w-4" /> Approve & Verify Partner
                  </button>
                  <button
                    onClick={() => setRejectingId(item.id)}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition inline-flex items-center gap-1.5"
                  >
                    <FiXCircle className="h-4 w-4" /> Reject Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiCheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">Verification Queue is Empty</h3>
          <p className="text-sm text-gray-500 mt-1">
            All builder verification requests have been processed.
          </p>
        </div>
      )}
    </div>
  )
}
