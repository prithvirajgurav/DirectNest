import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FiMapPin, FiHeart, FiShare2, FiCheckCircle, FiCalendar, FiMail,
  FiFlag, FiStar, FiUser, FiInfo, FiLayers, FiCompass, FiShield,
  FiCheck, FiHome, FiClock
} from 'react-icons/fi'
import propertyApi from '../../api/propertyApi'
import enquiryApi from '../../api/enquiryApi'
import siteVisitApi from '../../api/siteVisitApi'
import favoriteApi from '../../api/favoriteApi'
import reportApi from '../../api/reportApi'
import reviewApi from '../../api/reviewApi'
import { useAuth } from '../../context/AuthContext'
import PropertyGallery from '../../components/property/PropertyGallery'
import AmenityList from '../../components/property/AmenityList'
import { toast } from 'react-toastify'

export default function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isCustomer } = useAuth()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewSummary, setReviewSummary] = useState(null)

  // Enquiry modal & form state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: 'I am interested in this property. Please get in touch with me.'
  })
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false)

  // Site Visit modal & form state
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [visitForm, setVisitForm] = useState({
    preferredDate: '',
    preferredTime: '10:00',
    notes: ''
  })
  const [submittingVisit, setSubmittingVisit] = useState(false)

  // Report modal & form state
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('INACCURATE_INFORMATION')
  const [reportDetails, setReportDetails] = useState('')
  const [submittingReport, setSubmittingReport] = useState(false)

  // Add review form state
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetchPropertyData = async () => {
      setLoading(true)
      try {
        const response = await propertyApi.getById(id)
        setProperty(response.data?.data || response.data)

        // Check favorite status if customer
        if (isCustomer) {
          try {
            const favRes = await favoriteApi.checkFavorite(id)
            const favData = favRes.data?.data !== undefined ? favRes.data.data : favRes.data
            setIsFavorite(favData?.favorite ?? favData ?? false)
          } catch (e) {
            console.error(e)
          }
        }

        // Fetch reviews
        try {
          const revRes = await reviewApi.getPropertyReviews(id)
          const revData = revRes.data?.data || revRes.data
          setReviews(revData?.content || (Array.isArray(revData) ? revData : []))
          const sumRes = await reviewApi.getPropertySummary(id)
          setReviewSummary(sumRes.data?.data || sumRes.data)
        } catch (e) {
          console.error(e)
        }
      } catch (error) {
        console.error('Failed to load property details:', error)
        toast.error('Property not found or unavailable')
        navigate('/properties')
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyData()
  }, [id, isCustomer, navigate])

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in as a customer to save favorites')
      navigate('/login')
      return
    }
    if (!isCustomer) {
      toast.info('Only customers can save favorites')
      return
    }

    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(id)
        setIsFavorite(false)
        toast.info('Removed from favorites')
      } else {
        await favoriteApi.addFavorite(id)
        setIsFavorite(true)
        toast.success('Saved to favorites!')
      }
    } catch (err) {
      toast.error('Failed to update favorites')
    }
  }

  const handleEnquirySubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info('Please log in to send an enquiry')
      navigate('/login')
      return
    }
    if (!isCustomer) {
      toast.info('Only registered buyers/customers can send direct enquiries')
      return
    }

    setSubmittingEnquiry(true)
    try {
      await enquiryApi.create({
        propertyId: property.id,
        message: enquiryForm.message,
        phone: enquiryForm.phone || user?.phone || ''
      })
      toast.success('Enquiry sent directly to the builder!')
      setShowEnquiryModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send enquiry')
    } finally {
      setSubmittingEnquiry(false)
    }
  }

  const handleVisitSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info('Please log in to schedule a site visit')
      navigate('/login')
      return
    }
    if (!isCustomer) {
      toast.info('Only registered buyers/customers can schedule visits')
      return
    }

    if (!visitForm.preferredDate) {
      toast.error('Please select a preferred date')
      return
    }

    setSubmittingVisit(true)
    try {
      const timeStr = visitForm.preferredTime
        ? (visitForm.preferredTime.length === 5 ? `${visitForm.preferredTime}:00` : visitForm.preferredTime)
        : '10:00:00'

      await siteVisitApi.schedule({
        propertyId: property.id,
        preferredDate: visitForm.preferredDate,
        preferredTime: timeStr,
        message: visitForm.notes
      })
      toast.success('Site visit request submitted successfully!')
      setShowVisitModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule site visit')
    } finally {
      setSubmittingVisit(false)
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info('Please log in to report a listing')
      navigate('/login')
      return
    }

    setSubmittingReport(true)
    try {
      await reportApi.create({
        propertyId: property.id,
        reason: reportReason,
        description: reportDetails
      })
      toast.success('Report submitted. Our moderation team will investigate.')
      setShowReportModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report')
    } finally {
      setSubmittingReport(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info('Please log in to write a review')
      return
    }
    if (!newComment.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    setSubmittingReview(true)
    try {
      await reviewApi.create({
        propertyId: property.id,
        rating: newRating,
        comment: newComment
      })
      toast.success('Review submitted successfully!')
      setNewComment('')
      // Refresh reviews
      const revRes = await reviewApi.getPropertyReviews(id)
      setReviews(revRes.data?.content || revRes.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Price on Request'
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`
    }
    return `₹${Number(price).toLocaleString('en-IN')}`
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading property details...</p>
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-indigo-600">Properties</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{property.title}</span>
        </nav>

        {/* Gallery */}
        <div className="mb-8">
          <PropertyGallery images={property.images || []} title={property.title} />
        </div>

        {/* Main Grid: Details Left + Action/Provider Card Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Property Specs & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price Header Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                      {property.propertyType?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      {property.listingType?.replace(/_/g, ' ')}
                    </span>
                    {property.possessionStatus && (
                      <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {property.possessionStatus?.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                    {property.title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-gray-600 mt-2 text-sm">
                    <FiMapPin className="text-indigo-600 shrink-0" />
                    <span>{property.locality}, {property.city}, {property.state}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-600">
                    {formatPrice(property.price)}
                  </div>
                  {property.builtUpArea && (
                    <div className="text-xs text-gray-500 mt-1">
                      ≈ ₹{Math.round(property.price / property.builtUpArea)} / sq.ft
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={handleFavoriteToggle}
                      className={`p-2.5 rounded-xl border transition ${
                        isFavorite
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-red-600 transition"
                      title="Report property"
                    >
                      <FiFlag className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Overview Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
                {property.bedrooms !== undefined && property.bedrooms !== null && (
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Bedrooms</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{property.bedrooms} BHK</div>
                  </div>
                )}
                {property.bathrooms !== undefined && property.bathrooms !== null && (
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Bathrooms</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{property.bathrooms}</div>
                  </div>
                )}
                {property.builtUpArea && (
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Built-up Area</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{property.builtUpArea} sq.ft</div>
                  </div>
                )}
                {property.furnishing && (
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Furnishing</div>
                    <div className="text-xl font-bold text-gray-900 mt-1 capitalize">
                      {property.furnishing?.toLowerCase().replace(/_/g, ' ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Overview & Specifications */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Property ID</span>
                  <span className="font-semibold text-gray-900">#DN-{property.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Property Type</span>
                  <span className="font-semibold text-gray-900">{property.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Listing Type</span>
                  <span className="font-semibold text-gray-900">{property.listingType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Possession Status</span>
                  <span className="font-semibold text-gray-900">{property.possessionStatus?.replace(/_/g, ' ') || 'Ready'}</span>
                </div>
                {property.carpetArea && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Carpet Area</span>
                    <span className="font-semibold text-gray-900">{property.carpetArea} sq.ft</span>
                  </div>
                )}
                {property.floorNumber !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Floor</span>
                    <span className="font-semibold text-gray-900">{property.floorNumber} {property.totalFloors ? `of ${property.totalFloors}` : ''}</span>
                  </div>
                )}
                {property.facing && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Facing</span>
                    <span className="font-semibold text-gray-900">{property.facing}</span>
                  </div>
                )}
                {property.reraId && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">RERA Registration</span>
                    <span className="font-mono font-semibold text-indigo-600">{property.reraId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Property</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {property.description || 'No detailed description provided for this property.'}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
              <AmenityList amenities={property.amenities || []} />
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Buyer Reviews ({reviews.length})
                </h2>
                {reviewSummary && (
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-amber-800 text-sm font-bold">
                    <FiStar className="fill-current text-amber-500" />
                    <span>{reviewSummary.averageRating?.toFixed(1) || '0.0'} / 5</span>
                  </div>
                )}
              </div>

              {/* Review list */}
              {reviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {rev.customerName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 text-sm">{rev.customerName || 'Customer'}</span>
                            <span className="text-xs text-gray-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-500 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar key={i} className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mb-8">No reviews yet for this listing. Be the first to review!</p>
              )}

              {/* Add Review Form */}
              {isAuthenticated && isCustomer && (
                <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-gray-100 space-y-4">
                  <h3 className="text-base font-bold text-gray-900">Write a Review</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`p-2 rounded-lg text-lg ${
                            star <= newRating ? 'text-amber-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Review</label>
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your feedback about the property or builder interaction..."
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Provider Card & Action Buttons */}
          <div className="lg:col-span-1 space-y-6">
            {/* Direct Connect Action Box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <div className="text-center pb-6 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Direct Price</div>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">
                  {formatPrice(property.price)}
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
                  <FiCheckCircle className="h-3.5 w-3.5" /> Zero Brokerage Direct Deal
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <FiMail className="h-4 w-4" />
                  Send Direct Enquiry
                </button>

                <button
                  onClick={() => setShowVisitModal(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                >
                  <FiCalendar className="h-4 w-4" />
                  Schedule Site Visit
                </button>
              </div>

              {/* Builder Profile Info */}
              {property.provider && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Listed Directly By
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center shrink-0">
                      {(property.provider.businessName || 'B').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-snug">
                        {property.provider.businessName || 'Verified Builder'}
                      </h4>
                      {property.provider.verificationStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <FiCheckCircle className="h-3 w-3" /> Verified Partner
                        </span>
                      )}
                    </div>
                  </div>

                  {property.provider.reraNumber && (
                    <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg font-mono">
                      RERA: {property.provider.reraNumber}
                    </div>
                  )}

                  <Link
                    to={`/providers/${property.provider.id}`}
                    className="mt-4 block text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                  >
                    View Builder Profile & All Listings →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-lg text-gray-900">Send Direct Enquiry</h3>
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={submittingEnquiry}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {submittingEnquiry ? 'Sending...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Site Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-lg text-gray-900">Schedule a Site Visit</h3>
              <button
                onClick={() => setShowVisitModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Date *</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={visitForm.preferredDate}
                  onChange={(e) => setVisitForm({ ...visitForm, preferredDate: e.target.value })}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Time</label>
                <input
                  type="time"
                  value={visitForm.preferredTime}
                  onChange={(e) => setVisitForm({ ...visitForm, preferredTime: e.target.value })}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                  placeholder="e.g. Please call before arriving"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={submittingVisit}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {submittingVisit ? 'Scheduling...' : 'Request Site Visit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-lg text-gray-900">Report Property Listing</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="INACCURATE_INFORMATION">Inaccurate or misleading information</option>
                  <option value="DUPLICATE_LISTING">Duplicate listing</option>
                  <option value="PROPERTY_UNAVAILABLE">Property already sold / rented</option>
                  <option value="FRAUDULENT_ACTIVITY">Suspected fraud or scam</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide additional details to help our moderation team..."
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReport}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition"
              >
                {submittingReport ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
