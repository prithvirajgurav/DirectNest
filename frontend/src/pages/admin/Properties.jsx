import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiHome, FiCheckCircle, FiClock, FiXCircle, FiEye, FiExternalLink, FiLayers } from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminProperties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') || ''

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(initialStatus)

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getProperties({
        page: 0,
        size: 50,
        status: statusFilter || undefined
      })
      const data = response.data?.data || response.data
      setProperties(data?.content || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to load admin properties:', error)
      toast.error('Failed to load property listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [statusFilter])

  const handleApprove = async (id) => {
    try {
      await adminApi.approveProperty(id)
      toast.success('Property approved and published live!')
      fetchProperties()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve property')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
      case 'PENDING_VERIFICATION':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>
      case 'DRAFT':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Draft</span>
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
          <h1 className="text-2xl font-extrabold text-gray-900">Property Listings Moderation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit property submissions, check legal documents, and approve listings for public search
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { label: 'All Listings', value: '' },
          { label: 'Pending Review', value: 'PENDING_VERIFICATION' },
          { label: 'Approved & Live', value: 'APPROVED' },
          { label: 'Drafts', value: 'DRAFT' },
          { label: 'Rejected', value: 'REJECTED' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value)
              setSearchParams(tab.value ? { status: tab.value } : {})
            }}
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
        <div className="p-8 text-center text-gray-500">Loading listings...</div>
      ) : properties.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Property</th>
                  <th className="py-3.5 px-6">Builder / Owner</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Submitted</th>
                  <th className="py-3.5 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{prop.title}</div>
                      <div className="text-gray-400 text-[11px]">{prop.locality}, {prop.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{prop.ownerName || prop.provider?.businessName || prop.provider?.user?.fullName || 'Builder'}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-indigo-600">
                      ₹{Number(prop.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {prop.propertyType}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(prop.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {new Date(prop.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/properties/${prop.id}/review`}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition"
                        >
                          Review & Audit
                        </Link>
                        {prop.status === 'PENDING_VERIFICATION' && (
                          <button
                            onClick={() => handleApprove(prop.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiHome className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No property listings found for this filter.</p>
        </div>
      )}
    </div>
  )
}
