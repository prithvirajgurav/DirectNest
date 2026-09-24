import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShield, FiCheckCircle, FiClock, FiAlertCircle, FiExternalLink, FiMapPin } from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getProviders({
        page: 0,
        size: 50,
        status: statusFilter || undefined
      })
      const data = response.data?.data || response.data
      setProviders(data?.content || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to load providers:', error)
      toast.error('Failed to load builder profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [statusFilter])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'VERIFIED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>
      case 'PENDING':
      case 'PENDING_VERIFICATION':
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Builder & Provider Directory</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of verified developers and property owners on DirectNest
          </p>
        </div>

        <Link
          to="/admin/verifications"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
        >
          Open Verification Queue →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { label: 'All Providers', value: '' },
          { label: 'Verified', value: 'VERIFIED' },
          { label: 'Pending Review', value: 'PENDING' },
          { label: 'Rejected', value: 'REJECTED' }
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

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading builders...</div>
      ) : providers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Company / Name</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">RERA ID</th>
                  <th className="py-3.5 px-6">Experience</th>
                  <th className="py-3.5 px-6">Verification</th>
                  <th className="py-3.5 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{p.businessName || p.user?.fullName}</div>
                      <div className="text-gray-400 text-[11px]">{p.user?.email}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-700">
                      {p.providerType}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {p.city ? `${p.city}, ${p.state}` : '—'}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-600">
                      {p.reraNumber || '—'}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {p.experienceYears ? `${p.experienceYears} Years` : '—'}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(p.verificationStatus)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/providers/${p.id}`}
                        target="_blank"
                        className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                      >
                        Public Profile <FiExternalLink />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiShield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No builder profiles found.</p>
        </div>
      )}
    </div>
  )
}
