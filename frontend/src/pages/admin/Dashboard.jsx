import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUsers, FiHome, FiShield, FiAlertTriangle, FiFlag,
  FiCheckCircle, FiClock, FiActivity, FiArrowRight
} from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await adminApi.getDashboardStats()
        setStats(response.data?.data || response.data || {})
      } catch (error) {
        console.error('Failed to load admin stats:', error)
        toast.error('Failed to load admin dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading admin metrics...</div>
  }

  const s = stats || {}

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Superadmin Control Center</h1>
          <p className="text-indigo-200 text-sm mt-1">
            Platform governance, provider credentials verification, property listing moderation, and user management.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{s.totalUsers ?? 0}</div>
            <div className="text-xs text-gray-500 font-medium">Registered Users</div>
          </div>
        </Link>

        <Link
          to="/admin/providers"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FiShield className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{s.totalBuilders ?? s.totalProviders ?? 0}</div>
            <div className="text-xs text-gray-500 font-medium">Builders & Owners</div>
          </div>
        </Link>

        <Link
          to="/admin/properties"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiHome className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{s.approvedProperties ?? s.totalProperties ?? 0}</div>
            <div className="text-xs text-gray-500 font-medium">Approved Listings</div>
          </div>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FiFlag className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{s.openReports ?? s.pendingReports ?? 0}</div>
            <div className="text-xs text-gray-500 font-medium">Open Reports</div>
          </div>
        </Link>
      </div>

      {/* Moderation Queue Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Property Reviews */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FiClock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Property Moderation Queue</h3>
                <p className="text-xs text-gray-500">
                  {s.pendingProperties ?? 0} properties awaiting verification review
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Review submitted floor plans, title deeds, and RERA credentials before publishing properties live.
          </p>

          <Link
            to="/admin/properties?status=PENDING_VERIFICATION"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition"
          >
            Review Property Submissions <FiArrowRight />
          </Link>
        </div>

        {/* Pending Builder Verifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Builder Verifications</h3>
                <p className="text-xs text-gray-500">
                  {s.pendingVerifications ?? 0} builder accounts pending approval
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Verify builder credentials, GSTIN certificates, and identity proofs to award verified badges.
          </p>

          <Link
            to="/admin/verifications"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
          >
            Review Builder Credentials <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}
