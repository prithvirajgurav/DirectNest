import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FiArrowLeft, FiCheckCircle, FiXCircle, FiHome, FiMapPin,
  FiFileText, FiImage, FiShield, FiExternalLink, FiDollarSign,
  FiCalendar, FiLayers, FiAlertCircle
} from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminPropertyReview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejecting, setRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchProperty = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getPropertyForReview(id)
      setProperty(response.data?.data || response.data)
    } catch (error) {
      console.error('Failed to load property for review:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperty()
  }, [id])

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this property listing? It will immediately become live and searchable to all buyers.')) {
      return
    }

    setSubmitting(true)
    try {
      await adminApi.approveProperty(id)
      toast.success('Property listing approved and published live!')
      navigate('/admin/properties')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve property')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectionReason.trim()) {
      toast.error('Please specify why this listing was rejected')
      return
    }

    setSubmitting(true)
    try {
      await adminApi.rejectProperty(id, rejectionReason)
      toast.info('Property listing rejected. Feedback sent to builder.')
      navigate('/admin/properties')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject property')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading audit details for property #{id}...</div>
  }

  if (!property) {
    return (
      <div className="p-12 text-center space-y-4">
        <FiAlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <h3 className="text-lg font-bold text-gray-800">Property Not Found</h3>
        <Link to="/admin/properties" className="text-indigo-600 font-bold hover:underline">
          ← Back to Moderation Queue
        </Link>
      </div>
    )
  }

  const p = property

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties"
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900">{p.title}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                p.status === 'PENDING_VERIFICATION' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                p.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                'bg-gray-100 text-gray-700'
              }`}>
                {p.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <FiMapPin className="text-indigo-600" />
              {p.addressLine || p.addressLine1 || ''}{p.locality ? `, ${p.locality}` : ''}{p.city ? `, ${p.city}` : ''}{p.state ? `, ${p.state}` : ''}{p.pincode ? ` - ${p.pincode}` : ''}
            </p>
          </div>
        </div>

        {/* Quick Action bar */}
        <div className="flex items-center gap-2">
          {p.status !== 'APPROVED' && (
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <FiCheckCircle className="h-4 w-4" /> Approve & Go Live
            </button>
          )}
          {p.status !== 'REJECTED' && !rejecting && (
            <button
              onClick={() => setRejecting(true)}
              disabled={submitting}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1.5"
            >
              <FiXCircle className="h-4 w-4" /> Reject Listing
            </button>
          )}
        </div>
      </div>

      {/* Rejection Drawer / Form */}
      {rejecting && (
        <form onSubmit={handleReject} className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <FiAlertCircle /> Specify Rejection Reason for Developer
            </h3>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="text-xs text-gray-500 hover:text-gray-700 font-semibold"
            >
              Cancel
            </button>
          </div>
          <textarea
            rows={3}
            required
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g., Incomplete floor plans uploaded, RERA number does not match property address, invalid occupancy certificate..."
            className="w-full p-3 border border-rose-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      )}

      {/* Primary Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Listing Price</span>
          <span className="text-lg font-black text-indigo-600">
            ₹{Number(p.price).toLocaleString('en-IN')}
          </span>
          {p.pricePerSqft && (
            <span className="text-[10px] text-gray-400 block mt-0.5">₹{p.pricePerSqft}/sq.ft</span>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Type & Category</span>
          <span className="text-base font-bold text-gray-800">
            {p.propertyType} • {p.listingType}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">{p.bedrooms || p.bhk || 0} BHK / {p.bathrooms || 0} Baths</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Carpet & Built-up</span>
          <span className="text-base font-bold text-gray-800">
            {p.areaSqft || p.builtUpArea || p.carpetArea || '—'} sq.ft
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Balconies: {p.balconies ?? '—'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">Possession / Floor</span>
          <span className="text-base font-bold text-gray-800">
            {p.possessionDate ? `Possession: ${p.possessionDate}` : (p.possessionStatus || 'Ready to Move')}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Floor: {p.floorNumber ?? '—'} of {p.totalFloors ?? '—'}</span>
        </div>
      </div>

      {/* Developer & Legal Credentials */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
          Builder & Legal Compliance Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-50 p-3.5 rounded-xl">
            <span className="text-gray-400 block font-semibold mb-1">Developer / Entity</span>
            <span className="font-bold text-gray-900 text-sm">
              {p.owner?.fullName || p.ownerName || p.provider?.businessName || p.provider?.user?.fullName || 'Direct Owner'}
            </span>
            <div className="text-gray-500 mt-1">
              Email: {p.owner?.email || p.ownerEmail || p.provider?.user?.email || '—'}
            </div>
            {(p.owner?.phone || p.ownerPhone || p.provider?.user?.phone) && (
              <div className="text-gray-500">
                Phone: {p.owner?.phone || p.ownerPhone || p.provider?.user?.phone}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl">
            <span className="text-gray-400 block font-semibold mb-1">Project RERA Number</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">
              {p.reraNumber || 'No Project RERA Given'}
            </span>
            <div className="text-gray-500 mt-1">
              Furnishing: <strong className="text-gray-800">{p.furnishingStatus || 'Unfurnished'}</strong>
            </div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl">
            <span className="text-gray-400 block font-semibold mb-1">Audit Trail</span>
            <div className="text-gray-500">
              Submitted: <strong>{new Date(p.createdAt).toLocaleString()}</strong>
            </div>
            {p.updatedAt && (
              <div className="text-gray-500 mt-1">
                Last Edited: <strong>{new Date(p.updatedAt).toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Amenities */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
          Description & Amenities
        </h3>
        <div className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl whitespace-pre-line">
          {p.description || 'No description provided by the builder.'}
        </div>

        {p.amenities && p.amenities.length > 0 && (
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Attached Amenities ({p.amenities.length})</span>
            <div className="flex flex-wrap gap-2">
              {p.amenities.map((am) => (
                <span
                  key={am.id || am.amenityId || am.name}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold"
                >
                  {am.name || am.amenity?.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submitted Legal Documents */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
            Submitted Legal Documents ({p.documents?.length || 0})
          </h3>
        </div>

        {p.documents && p.documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {p.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FiFileText className="text-indigo-600 h-4 w-4 shrink-0" />
                  <div>
                    <div className="font-bold text-gray-800 truncate">{doc.documentType}</div>
                    <div className="text-[10px] text-gray-400">Uploaded by builder</div>
                  </div>
                </div>
                <a
                  href={doc.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-indigo-600 font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 transition"
                >
                  View File <FiExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-amber-50/50 rounded-xl border border-amber-200 text-center text-amber-700 text-xs">
            ⚠️ No legal documents or certificates were attached to this property listing.
          </div>
        )}
      </div>

      {/* Property Gallery Images */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
          Uploaded Property Photos ({p.images?.length || 0})
        </h3>

        {p.images && p.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {p.images.map((img) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
                <img
                  src={img.imageUrl}
                  alt={img.caption || 'Property photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {img.primary && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-md shadow">
                    Cover Photo
                  </span>
                )}
                <a
                  href={img.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <FiExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-400 text-xs">
            No gallery images uploaded.
          </div>
        )}
      </div>
    </div>
  )
}
