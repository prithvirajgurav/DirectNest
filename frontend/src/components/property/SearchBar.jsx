import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin } from 'react-icons/fi'

export default function SearchBar({ initialCity = '', initialType = '', className = '' }) {
  const [city, setCity] = useState(initialCity)
  const [propertyType, setPropertyType] = useState(initialType)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city.trim()) params.append('city', city.trim())
    if (propertyType) params.append('propertyType', propertyType)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-3 ${className}`}>
      {/* City input */}
      <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
        <FiMapPin className="text-primary-600 h-5 w-5 shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] font-semibold text-gray-500 uppercase">Location</label>
          <input
            type="text"
            placeholder="Enter city (e.g. Kolhapur, Pune, Mumbai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-full">
          <label className="block text-[10px] font-semibold text-gray-500 uppercase">Property Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
          >
            <option value="">All Property Types</option>
            <option value="APARTMENT">Apartment / Flat</option>
            <option value="VILLA">Independent Villa</option>
            <option value="PLOT">Residential / Commercial Plot</option>
            <option value="COMMERCIAL">Commercial Office / Space</option>
            <option value="ROW_HOUSE">Row House</option>
            <option value="PENTHOUSE">Luxury Penthouse</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="btn-primary py-3 px-8 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        <FiSearch className="h-5 w-5" />
        <span>Search Properties</span>
      </button>
    </form>
  )
}
