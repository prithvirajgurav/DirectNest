import PropertyCard from './PropertyCard'
import EmptyState from '../common/EmptyState'
import { FiHome } from 'react-icons/fi'

export default function PropertyGrid({ properties, onFavoriteToggle }) {
  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon={FiHome}
        title="No properties found"
        message="Try adjusting your search filters or check back later for new listings."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onFavoriteToggle={onFavoriteToggle}
          initialFavorite={property.isFavorite}
        />
      ))}
    </div>
  )
}
