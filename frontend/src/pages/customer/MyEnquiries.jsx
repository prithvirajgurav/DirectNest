import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiCalendar, FiClock, FiCheckCircle, FiExternalLink, FiSearch } from 'react-icons/fi'
import { enquiryApi } from '../../api/enquiryApi'
import { toast } from 'react-toastify'

export default function MyEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true)
      try {
        const response = await enquiryApi.getUserEnquiries({ page: 0, size: 50 })
        const raw = response.data?.data || response.data
        setEnquiries(raw?.content || (Array.isArray(raw) ? raw : []))
      } catch (error) {
        console.error('Failed to load enquiries:', error)
        toast.error('Failed to load enquiries')
      } finally {
        setLoading(false)
      }
    }
    fetchEnquiries()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESPONDED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Responded</span>
      case 'PENDING':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Pending Reply</span>
      case 'CLOSED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">Closed</span>
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Direct Enquiries</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your direct message threads with verified builders and property owners
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
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-32"></div>
          ))}
        </div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {enq.property?.title || enq.propertyTitle || `Property #${enq.property?.id || enq.propertyId}`}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <FiClock /> {new Date(enq.createdAt).toLocaleDateString()} at {new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {(enq.property?.ownerName || enq.providerName) && (
                      <span>To Builder: <strong>{enq.property?.ownerName || enq.providerName}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(enq.status)}
                  {(enq.property?.id || enq.propertyId) && (
                    <Link
                      to={`/properties/${enq.property?.id || enq.propertyId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View Property <FiExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Message Sent */}
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Your Message:</div>
                  <p className="text-gray-800">{enq.message}</p>
                </div>

                {/* Builder Response */}
                {(enq.response || enq.responseMessage) && (
                  <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100">
                    <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1">Builder Reply:</div>
                    <p className="text-indigo-900">{enq.response || enq.responseMessage}</p>
                    {enq.respondedAt && (
                      <span className="text-[11px] text-indigo-500 mt-1 block">
                        Replied on {new Date(enq.respondedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiMail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Enquiries Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            When you view property details, you can send direct messages to verified builders.
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
