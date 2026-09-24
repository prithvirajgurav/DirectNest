import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiHome, FiMail, FiCalendar, FiCheckCircle, FiAlertTriangle,
  FiPlus, FiArrowRight, FiShield, FiTrendingUp
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { builderApi } from '../../api/builderApi'
import { propertyApi } from '../../api/propertyApi'
import { enquiryApi } from '../../api/enquiryApi'
import { siteVisitApi } from '../../api/siteVisitApi'

export default function BuilderDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    totalProperties: 0,
    approvedProperties: 0,
    pendingProperties: 0,
    enquiriesCount: 0,
    siteVisitsCount: 0
  })
  const [recentProperties, setRecentProperties] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [recentVisits, setRecentVisits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      try {
        const [profRes, propsRes, enqRes, visRes] = await Promise.allSettled([
          builderApi.getProfile(),
          propertyApi.getMyProperties({ page: 0, size: 5 }),
          builderApi.getEnquiries({ page: 0, size: 4 }),
          builderApi.getSiteVisits({ page: 0, size: 4 })
        ])

        if (profRes.status === 'fulfilled') {
          setProfile(profRes.value.data?.data || profRes.value.data)
        }

        const propsRaw = propsRes.status === 'fulfilled' ? (propsRes.value.data?.data || propsRes.value.data) : { content: [], totalElements: 0 }
        const enqsRaw = enqRes.status === 'fulfilled' ? (enqRes.value.data?.data || enqRes.value.data) : { content: [], totalElements: 0 }
        const visitsRaw = visRes.status === 'fulfilled' ? (visRes.value.data?.data || visRes.value.data) : { content: [], totalElements: 0 }

        const propList = propsRaw.content || (Array.isArray(propsRaw) ? propsRaw : [])
        const approved = propList.filter(p => p.status === 'APPROVED').length
        const pending = propList.filter(p => p.status === 'PENDING_VERIFICATION' || p.status === 'DRAFT').length

        const enqList = enqsRaw.content || (Array.isArray(enqsRaw) ? enqsRaw : [])
        const visList = visitsRaw.content || (Array.isArray(visitsRaw) ? visitsRaw : [])

        setStats({
          totalProperties: propsRaw.totalElements !== undefined ? propsRaw.totalElements : propList.length,
          approvedProperties: approved,
          pendingProperties: pending,
          enquiriesCount: enqsRaw.totalElements !== undefined ? enqsRaw.totalElements : enqList.length,
          siteVisitsCount: visitsRaw.totalElements !== undefined ? visitsRaw.totalElements : visList.length
        })

        setRecentProperties(propList.slice(0, 4))
        setRecentEnquiries(enqList.slice(0, 4))
        setRecentVisits(visList.slice(0, 4))
      } catch (err) {
        console.error('Failed to load builder dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const isVerified = profile?.verificationStatus === 'APPROVED' || profile?.verificationStatus === 'VERIFIED'
  const isPending = !isVerified

  return (
    <div className="space-y-8">
      {/* Verification Status Banner */}
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Account Verification</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Submit your business RERA / ID documents to get verified and publish listings directly to buyers.
              </p>
            </div>
          </div>
          <Link
            to="/builder/verification"
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition shrink-0"
          >
            Upload Documents
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {profile?.businessName || profile?.companyName || user?.fullName || 'Builder Partner'}
            </h1>
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <FiCheckCircle className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>
          <p className="text-indigo-200 text-sm mt-1">
            Direct real estate management hub. Control listings, buyer messages, and site inspections.
          </p>
        </div>

        <Link
          to="/builder/properties/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow transition shrink-0"
        >
          <FiPlus className="h-4 w-4" /> Add New Listing
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/builder/properties"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiHome className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalProperties}</div>
            <div className="text-xs text-gray-500 font-medium">Total Listings</div>
          </div>
        </Link>

        <Link
          to="/builder/enquiries"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FiMail className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.enquiriesCount}</div>
            <div className="text-xs text-gray-500 font-medium">Buyer Enquiries</div>
          </div>
        </Link>

        <Link
          to="/builder/site-visits"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCalendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.siteVisitsCount}</div>
            <div className="text-xs text-gray-500 font-medium">Site Visits</div>
          </div>
        </Link>

        <Link
          to="/builder/verification"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiShield className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900 uppercase">
              {profile?.verificationStatus || 'PENDING'}
            </div>
            <div className="text-xs text-gray-500 font-medium">Partner Status</div>
          </div>
        </Link>
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Property Listings</h2>
          <Link to="/builder/properties" className="text-xs font-semibold text-indigo-600 hover:underline">
            View All
          </Link>
        </div>

        {recentProperties.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentProperties.map((prop) => (
              <div key={prop.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{prop.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{prop.locality}, {prop.city}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600">₹{Number(prop.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    prop.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                    prop.status === 'PENDING_VERIFICATION' ? 'bg-amber-50 text-amber-700' :
                    prop.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {prop.status}
                  </span>
                  <Link
                    to={`/builder/properties/${prop.id}/edit`}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-lg text-xs hover:bg-gray-200"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-3">You have not listed any properties yet.</p>
            <Link
              to="/builder/properties/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
            >
              <FiPlus /> Add Your First Property
            </Link>
          </div>
        )}
      </div>

      {/* Grid: Recent Enquiries & Site Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enquiries */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Buyer Enquiries</h2>
            <Link to="/builder/enquiries" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {enq.customer?.fullName || enq.customerName || 'Customer Inquiry'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{enq.message}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
                    enq.status === 'RESPONDED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center">No buyer enquiries yet.</p>
          )}
        </div>

        {/* Site Visits */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Site Visit Requests</h2>
            <Link to="/builder/site-visits" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {recentVisits.length > 0 ? (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {visit.customer?.fullName || visit.customerName || 'Buyer Visit'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📅 {visit.preferredDate ? `${visit.preferredDate} at ${visit.preferredTime || ''}` : (visit.visitDate ? new Date(visit.visitDate).toLocaleString() : 'Requested')}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${
                    visit.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' :
                    visit.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic py-6 text-center">No site visit requests.</p>
          )}
        </div>
      </div>
    </div>
  )
}
