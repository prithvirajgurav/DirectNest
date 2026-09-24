import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiCheckCircle, FiMapPin, FiBriefcase, FiMail, FiPhone, FiGlobe, FiLayers, FiShield } from 'react-icons/fi'
import builderApi from '../../api/builderApi'
import propertyApi from '../../api/propertyApi'
import PropertyCard from '../../components/property/PropertyCard'
import { toast } from 'react-toastify'

export default function ProviderProfile() {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await builderApi.getPublicProvider(id)
        setProvider(response.data?.data || response.data)

        // Fetch properties by this provider
        try {
          const propRes = await propertyApi.search({ providerId: id, size: 20 })
          const propData = propRes.data?.data || propRes.data
          setProperties(propData?.content || (Array.isArray(propData) ? propData : []))
        } catch (e) {
          console.error(e)
        }
      } catch (error) {
        console.error('Failed to load provider profile:', error)
        toast.error('Provider profile not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading builder profile...</p>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Partner profile not found</h2>
        <Link to="/properties" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">
          Browse all properties
        </Link>
      </div>
    )
  }

  const isVerified = provider.verificationStatus === 'APPROVED' || provider.verificationStatus === 'VERIFIED'

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-3xl shadow-inner">
                {(provider.businessName || provider.user?.fullName || 'B').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {provider.businessName || provider.user?.fullName}
                  </h1>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <FiCheckCircle className="h-4 w-4" /> Verified Builder
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {provider.providerType === 'OWNER' ? 'Individual Property Owner' : 'Real Estate Developer / Builder'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-3">
                  {provider.city && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-indigo-600" /> {provider.city}, {provider.state}
                    </span>
                  )}
                  {provider.experienceYears !== undefined && (
                    <span className="flex items-center gap-1">
                      <FiBriefcase className="text-indigo-600" /> {provider.experienceYears} Years in Real Estate
                    </span>
                  )}
                  {provider.reraNumber && (
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      RERA: {provider.reraNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description / Bio */}
          {provider.description && (
            <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-700 leading-relaxed">
              {provider.description}
            </div>
          )}
        </div>

        {/* Listings Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Properties by {provider.businessName || 'this Partner'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {properties.length} verified listings available directly
              </p>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FiLayers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No active listings from this provider currently.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
