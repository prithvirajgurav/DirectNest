import { FiCheckCircle } from 'react-icons/fi'

export default function AmenityList({ amenities = [] }) {
  if (!amenities || amenities.length === 0) {
    return <p className="text-sm text-gray-500 italic">No amenities specified for this property.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {amenities.map((amenity, index) => {
        const name = typeof amenity === 'string' ? amenity : amenity.name
        return (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-800"
          >
            <FiCheckCircle className="text-green-600 h-4 w-4 shrink-0" />
            <span className="font-medium truncate">{name}</span>
          </div>
        )
      })}
    </div>
  )
}
