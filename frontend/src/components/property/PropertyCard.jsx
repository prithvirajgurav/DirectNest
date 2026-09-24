import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiMapPin, FiMaximize2, FiCheckCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import favoriteApi from '../../api/favoriteApi'
import { toast } from 'react-toastify'

export default function PropertyCard({ property, onFavoriteToggle, initialFavorite = false }) {
  const { isCustomer } = useAuth()
  const [isFav, setIsFav] = useState(initialFavorite)
  const [loadingFav, setLoadingFav] = useState(false)

  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹ N/A'
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} L`
    }
    return `₹ ${price.toLocaleString('en-IN')}`
  }

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isCustomer) {
      toast.info('Please sign in as a customer to save favorites')
      return
    }

    setLoadingFav(true)
    try {
      if (isFav) {
        await favoriteApi.removeFavorite(property.id)
        setIsFav(false)
        toast.info('Removed from favorites')
      } else {
        await favoriteApi.addFavorite(property.id)
        setIsFav(true)
        toast.success('Added to favorites!')
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, !isFav)
      }
    } catch {
      toast.error('Failed to update favorite')
    } finally {
      setLoadingFav(false)
    }
  }

  const primaryImage =
    property.primaryImageUrl ||
    property.primaryImage ||
    property.images?.find((i) => i.primary)?.imageUrl ||
    property.images?.[0]?.imageUrl ||
    property.images?.[0]?.filePath ||
    property.images?.[0]
  const imageSrc = primaryImage
    ? (typeof primaryImage === 'string' && primaryImage.startsWith('http') ? primaryImage : `/uploads/${primaryImage}`)
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60'

  const ownerDisplayName =
    property.ownerName ||
    property.owner?.fullName ||
    property.provider?.businessName ||
    property.provider?.user?.fullName ||
    property.providerName ||
    property.providerCompanyName ||
    'Direct Owner'

  const locationDisplay = property.locality
    ? `${property.locality}, ${property.city}`
    : (property.city || 'India')

  return (
    <div className="card group hover:shadow-md transition-all duration-200 flex flex-col h-full bg-white">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60'
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="badge bg-primary-600 text-white font-semibold text-xs px-2.5 py-1 rounded-md shadow-sm">
            {property.propertyType?.replace(/_/g, ' ') || 'Residential'}
          </span>
          {property.possessionStatus && (
            <span className="badge bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] px-2 py-0.5 rounded-md shadow-sm font-medium">
              {property.possessionStatus.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFav}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
            isFav
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
          }`}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        >
          <FiHeart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
          {formatPrice(property.price)}
          {property.isNegotiable && <span className="text-[10px] font-normal text-gray-300 ml-1">(Negotiable)</span>}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link to={`/properties/${property.id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-primary-600 transition-colors text-base mb-1">
              {property.title}
            </h3>
          </Link>

          <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <FiMapPin className="h-3.5 w-3.5 shrink-0 text-primary-500" />
            <span className="truncate">{locationDisplay}</span>
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-xs text-gray-600 mb-3">
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{property.bedrooms || property.bhk || 0}</span>
              <span className="text-[10px] text-gray-400">Beds</span>
            </div>
            <div className="text-center border-x border-gray-100">
              <span className="block font-semibold text-gray-900">{property.bathrooms || 0}</span>
              <span className="text-[10px] text-gray-400">Baths</span>
            </div>
            <div className="text-center">
              <span className="block font-semibold text-gray-900">{property.areaSqft || property.builtUpArea || property.carpetArea || '--'}</span>
              <span className="text-[10px] text-gray-400">sq.ft</span>
            </div>
          </div>
        </div>

        {/* Provider Info & Action */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <span className="text-gray-500">By:</span>
            <span className="font-medium text-gray-900 truncate">
              {ownerDisplayName}
            </span>
            {(property.providerVerified || property.owner?.verified) && (
              <FiCheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" title="Verified Provider" />
            )}
          </div>

          <Link
            to={`/properties/${property.id}`}
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
