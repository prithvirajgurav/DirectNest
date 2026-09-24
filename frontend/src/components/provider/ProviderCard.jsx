import { Link } from 'react-router-dom'
import { FiCheckCircle, FiMapPin, FiBriefcase, FiArrowRight } from 'react-icons/fi'

export default function ProviderCard({ provider }) {
  if (!provider) return null

  const isVerified = provider.verificationStatus === 'VERIFIED'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
            {(provider.businessName || provider.user?.fullName || 'B').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-snug">
              {provider.businessName || provider.user?.fullName || 'Verified Partner'}
            </h3>
            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {provider.providerType || 'BUILDER'}
            </span>
          </div>
        </div>

        {isVerified && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <FiCheckCircle className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {provider.description || 'Verified property owner and real estate developer on DirectNest.'}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl">
        {provider.experienceYears !== undefined && provider.experienceYears !== null && (
          <div className="flex items-center gap-1.5">
            <FiBriefcase className="text-gray-400 shrink-0" />
            <span>{provider.experienceYears} Years Exp.</span>
          </div>
        )}
        {provider.city && (
          <div className="flex items-center gap-1.5">
            <FiMapPin className="text-gray-400 shrink-0" />
            <span className="truncate">{provider.city}</span>
          </div>
        )}
        {provider.reraNumber && (
          <div className="col-span-2 text-gray-500 font-mono text-[11px] truncate">
            RERA: {provider.reraNumber}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Link
          to={`/providers/${provider.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition"
        >
          View Profile & Listings
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
