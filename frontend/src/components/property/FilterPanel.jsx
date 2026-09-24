import { useState, useEffect } from 'react'
import { FiFilter, FiRotateCcw, FiHome, FiDollarSign, FiCheckSquare, FiUser } from 'react-icons/fi'
import amenityApi from '../../api/amenityApi'

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const [amenitiesList, setAmenitiesList] = useState([])

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      const res = await amenityApi.getAllAmenities()
      setAmenitiesList(res.data.data || res.data || [])
    } catch (err) {
      console.error('Failed to load amenities for filter panel', err)
    }
  }

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const handleAmenityToggle = (amenityId) => {
    const current = Array.isArray(filters.amenityIds)
      ? filters.amenityIds
      : typeof filters.amenityIds === 'string' && filters.amenityIds.length > 0
        ? filters.amenityIds.split(',').map(Number).filter(Boolean)
        : []

    const idNum = Number(amenityId)
    const updated = current.includes(idNum)
      ? current.filter((id) => id !== idNum)
      : [...current, idNum]

    handleChange('amenityIds', updated)
  }

  const currentAmenityIds = Array.isArray(filters.amenityIds)
    ? filters.amenityIds
    : typeof filters.amenityIds === 'string' && filters.amenityIds.length > 0
      ? filters.amenityIds.split(',').map(Number).filter(Boolean)
      : []

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <FiFilter className="text-primary-600 h-5 w-5" />
          <h3 className="font-bold text-gray-900 text-base">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors"
        >
          <FiRotateCcw className="h-3 w-3" /> Reset All
        </button>
      </div>

      {/* Listing Type (Buy / Rent) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Purpose</label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'All', value: '' },
            { label: 'Buy / Sale', value: 'SALE' },
            { label: 'Rent', value: 'RENT' }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange('listingType', item.value)}
              className={`text-xs py-2 px-1 rounded-lg border font-medium transition-colors ${
                (filters.listingType || '') === item.value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* City & Locality */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Location</label>
        <input
          type="text"
          placeholder="City (e.g. Kolhapur)"
          value={filters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          className="input-field text-sm py-2 w-full"
        />
        <input
          type="text"
          placeholder="Locality (e.g. Tarabai Park)"
          value={filters.locality || ''}
          onChange={(e) => handleChange('locality', e.target.value)}
          className="input-field text-sm py-2 w-full"
        />
      </div>

      {/* Bedrooms (BHK) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bedrooms (BHK)</label>
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: 'All', value: '' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4+', value: '4' }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange('bedrooms', (filters.bedrooms || '') === item.value ? '' : item.value)}
              className={`text-xs py-2 rounded-lg border font-semibold transition-colors ${
                String(filters.bedrooms || '') === item.value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Property Type</label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Apartment', value: 'APARTMENT' },
            { label: 'Villa', value: 'VILLA' },
            { label: 'Row House', value: 'ROW_HOUSE' },
            { label: 'Penthouse', value: 'PENTHOUSE' },
            { label: 'Plot', value: 'PLOT' },
            { label: 'Commercial', value: 'COMMERCIAL' }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange('propertyType', filters.propertyType === item.value ? '' : item.value)}
              className={`text-xs py-2 px-1 rounded-lg border font-medium transition-colors ${
                filters.propertyType === item.value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Budget Range (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input-field text-xs py-2 w-full"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input-field text-xs py-2 w-full"
          />
        </div>
      </div>

      {/* Furnishing Status */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Furnishing</label>
        <select
          value={filters.furnishingStatus || ''}
          onChange={(e) => handleChange('furnishingStatus', e.target.value)}
          className="input-field text-xs py-2 w-full"
        >
          <option value="">All Furnishing</option>
          <option value="UNFURNISHED">Unfurnished</option>
          <option value="SEMI_FURNISHED">Semi-Furnished</option>
          <option value="FULLY_FURNISHED">Fully-Furnished</option>
        </select>
      </div>

      {/* Provider Type */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Listed By</label>
        <select
          value={filters.providerType || ''}
          onChange={(e) => handleChange('providerType', e.target.value)}
          className="input-field text-xs py-2 w-full"
        >
          <option value="">All Providers</option>
          <option value="BUILDER">Builders & Developers</option>
          <option value="OWNER">Direct Owners</option>
        </select>
      </div>

      {/* Key Amenities Checkboxes */}
      {amenitiesList.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Key Amenities
            </label>
            {currentAmenityIds.length > 0 && (
              <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                {currentAmenityIds.length} selected
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 italic">Properties must match all selected</p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {amenitiesList.map((amenity) => {
              const isChecked = currentAmenityIds.includes(Number(amenity.id))
              return (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2.5 text-xs p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isChecked ? 'bg-primary-50 text-primary-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <span>{amenity.name}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
