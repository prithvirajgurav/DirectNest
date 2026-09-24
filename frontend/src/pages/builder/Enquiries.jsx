import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiSend, FiClock, FiCheckCircle, FiExternalLink } from 'react-icons/fi'
import { builderApi } from '../../api/builderApi'
import { toast } from 'react-toastify'

export default function BuilderEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [respondingId, setRespondingId] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const response = await builderApi.getEnquiries({ page: 0, size: 50 })
      const raw = response.data?.data || response.data
      setEnquiries(raw?.content || (Array.isArray(raw) ? raw : []))
    } catch (error) {
      console.error('Failed to load builder enquiries:', error)
      toast.error('Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const handleSendReply = async (e, enquiryId) => {
    e.preventDefault()
    if (!replyMessage.trim()) {
      toast.error('Please enter a response message')
      return
    }

    setSubmittingReply(true)
    try {
      await builderApi.respondToEnquiry(enquiryId, { response: replyMessage })
      toast.success('Response sent directly to the buyer!')
      setRespondingId(null)
      setReplyMessage('')
      fetchEnquiries()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send response')
    } finally {
      setSubmittingReply(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Direct Buyer Enquiries</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Respond directly to interested home buyers and tenants without broker interference
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-36"></div>
          ))}
        </div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    From: {enq.customer?.fullName || enq.customerName || 'Interested Buyer'}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    {(enq.customer?.phone || enq.phone || enq.customerPhone) && <span>📞 {enq.customer?.phone || enq.phone || enq.customerPhone}</span>}
                    {(enq.customer?.email || enq.customerEmail) && <span>✉️ {enq.customer?.email || enq.customerEmail}</span>}
                    <span>•</span>
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    enq.status === 'RESPONDED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {enq.status}
                  </span>

                  {(enq.property?.id || enq.propertyId) && (
                    <Link
                      to={`/properties/${enq.property?.id || enq.propertyId}`}
                      target="_blank"
                      className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      {enq.property?.title || enq.propertyTitle || `Property #${enq.property?.id || enq.propertyId}`} <FiExternalLink />
                    </Link>
                  )}
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-800">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Inquiry Message:</div>
                <p>{enq.message}</p>
              </div>

              {/* Previous Response */}
              {(enq.response || enq.responseMessage) ? (
                <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 text-sm">
                  <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1">Your Response:</div>
                  <p className="text-indigo-900">{enq.response || enq.responseMessage}</p>
                  {enq.respondedAt && (
                    <span className="text-[11px] text-indigo-500 mt-1 block">
                      Sent on {new Date(enq.respondedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  {respondingId === enq.id ? (
                    <form onSubmit={(e) => handleSendReply(e, enq.id)} className="space-y-3 pt-2">
                      <textarea
                        rows={3}
                        required
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Write your response to the buyer (e.g. availability, pricing, brochure details)..."
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={submittingReply}
                          className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition inline-flex items-center gap-1.5"
                        >
                          <FiSend className="h-3.5 w-3.5" />
                          {submittingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRespondingId(null)
                            setReplyMessage('')
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => {
                        setRespondingId(enq.id)
                        setReplyMessage('')
                      }}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5"
                    >
                      <FiSend className="h-3.5 w-3.5" /> Reply to Buyer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiMail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Inquiries Received</h3>
          <p className="text-sm text-gray-500 mt-1">
            Buyer inquiries sent on your property listings will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
