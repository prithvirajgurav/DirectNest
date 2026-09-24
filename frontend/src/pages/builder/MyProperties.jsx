import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus, FiEdit, FiImage, FiFileText, FiTrash2, FiEye,
  FiCheckCircle, FiClock, FiXCircle, FiSearch, FiLayers
} from 'react-icons/fi'
import { propertyApi } from '../../api/propertyApi'
import { toast } from 'react-toastify'

export default function MyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await propertyApi.getMyProperties({
        page: 0,
        size: 50,
        status: statusFilter || undefined
      })
      const data = response.data?.data || response.data
      const content = data?.content || (Array.isArray(data) ? data : [])
      setProperties(content)
    } catch (error) {
      console.error('Failed to load builder properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [statusFilter])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await propertyApi.deleteProperty(id)
      toast.success('Property deleted successfully')
      fetchProperties()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete property')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
      case 'PENDING_VERIFICATION':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>
      case 'DRAFT':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">Draft</span>
      case 'REJECTED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Property Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your real estate listings, photos, approvals, and legal documents
          </p>
        </div>

        <Link
          to="/builder/properties/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-sm transition self-start sm:self-auto"
        >
          <FiPlus className="h-4 w-4" /> Add New Property
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { label: 'All Listings', value: '' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Pending Review', value: 'PENDING_VERIFICATION' },
          { label: 'Drafts', value: 'DRAFT' },
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

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-28"></div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                  {prop.primaryImageUrl || (prop.images && prop.images.length > 0) ? (
                    <img
                      src={prop.primaryImageUrl || prop.images.find(img => img.primary)?.imageUrl || prop.images[0].imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiLayers className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 text-lg">{prop.title}</h3>
                    {getStatusBadge(prop.status)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {prop.locality}, {prop.city} • {prop.propertyType} • {prop.bedrooms ? `${prop.bedrooms} BHK` : ''}
                  </p>
                  <div className="text-sm font-bold text-indigo-600 mt-2">
                    ₹{Number(prop.price).toLocaleString('en-IN')}
                    {(prop.areaSqft || prop.builtUpArea) && (
                      <span className="text-xs text-gray-400 font-normal"> ({prop.areaSqft || prop.builtUpArea} sq.ft)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                {prop.status === 'APPROVED' && (
                  <Link
                    to={`/properties/${prop.id}`}
                    target="_blank"
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    title="View Public Page"
                  >
                    <FiEye className="h-4 w-4" /> View
                  </Link>
                )}

                <Link
                  to={`/builder/properties/${prop.id}/edit`}
                  className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <FiEdit className="h-4 w-4" /> Edit
                </Link>

                <Link
                  to={`/builder/properties/${prop.id}/images`}
                  className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <FiImage className="h-4 w-4" /> Photos
                </Link>

                <Link
                  to={`/builder/properties/${prop.id}/documents`}
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <FiFileText className="h-4 w-4" /> Docs
                </Link>

                <button
                  onClick={() => handleDelete(prop.id, prop.title)}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  title="Delete Property"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiLayers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Properties Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            Get started by adding your residential or commercial real estate listing.
          </p>
          <Link
            to="/builder/properties/add"
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Add Property
          </Link>
        </div>
      )}
    </div>
  )
}
