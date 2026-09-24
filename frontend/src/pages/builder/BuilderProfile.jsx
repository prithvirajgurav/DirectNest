import { useState, useEffect } from 'react'
import { FiBriefcase, FiMapPin, FiPhone, FiGlobe, FiFileText, FiCheckCircle } from 'react-icons/fi'
import { builderApi } from '../../api/builderApi'
import { toast } from 'react-toastify'

export default function BuilderProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    businessName: '',
    providerType: 'BUILDER',
    experienceYears: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    reraNumber: '',
    description: '',
    websiteUrl: '',
    verificationStatus: 'PENDING_VERIFICATION'
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await builderApi.getProfile()
        const p = response.data?.data || response.data
        if (p) {
          setProfile({
            businessName: p.businessName || p.companyName || '',
            providerType: p.providerType || 'BUILDER',
            experienceYears: p.experienceYears || p.yearsOfExperience || '',
            address: p.address || p.companyAddress || '',
            city: p.city || p.companyCity || '',
            state: p.state || p.companyState || '',
            pincode: p.pincode || p.companyPincode || '',
            reraNumber: p.reraNumber || p.gstin || '',
            description: p.description || p.companyDescription || '',
            websiteUrl: p.websiteUrl || '',
            verificationStatus: p.verificationStatus || 'PENDING_VERIFICATION'
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await builderApi.updateProfile({
        ...profile,
        experienceYears: profile.experienceYears ? parseInt(profile.experienceYears, 10) : 0
      })
      toast.success('Builder profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading builder profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Builder Company Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            This information is shown to buyers on your public listings and builder profile
          </p>
        </div>
        {(profile.verificationStatus === 'APPROVED' || profile.verificationStatus === 'VERIFIED') && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            <FiCheckCircle className="h-4 w-4" /> Verified Partner
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Business Name *</label>
              <input
                type="text"
                required
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Partner Type</label>
              <select
                value={profile.providerType}
                onChange={(e) => setProfile({ ...profile, providerType: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="BUILDER">Builder / Developer</option>
                <option value="OWNER">Property Owner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">RERA Number / GSTIN</label>
              <input
                type="text"
                value={profile.reraNumber}
                onChange={(e) => setProfile({ ...profile, reraNumber: e.target.value })}
                placeholder="e.g. P52800012345"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={profile.experienceYears}
                onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Company Description / About</label>
            <textarea
              rows={4}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              placeholder="Tell buyers about your projects, quality assurance, and track record..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              value={profile.websiteUrl}
              onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
              placeholder="https://acmebuilders.com"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition text-sm"
          >
            {saving ? 'Saving Profile...' : 'Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  )
}
