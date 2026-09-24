import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiDollarSign, FiMapPin, FiCheckCircle, FiLayers } from 'react-icons/fi'
import { propertyApi } from '../../api/propertyApi'
import { amenityApi } from '../../api/amenityApi'
import { toast } from 'react-toastify'

export default function AddProperty() {
  const navigate = useNavigate()
  const [amenities, setAmenities] = useState([])
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    price: '',
    areaSqft: '',
    carpetArea: '',
    bedrooms: '2',
    bathrooms: '2',
    balconies: '1',
    furnishingStatus: 'UNFURNISHED',
    floorNumber: '3',
    totalFloors: '7',
    addressLine: '',
    locality: '',
    city: 'Kolhapur',
    state: 'Maharashtra',
    pincode: '416003',
    amenityIds: []
  })

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await amenityApi.getAll()
        const data = response.data?.data || response.data || []
        setAmenities(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Failed to load amenities:', e)
      }
    }
    fetchAmenities()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAmenityToggle = (id) => {
    setForm(prev => {
      const exists = prev.amenityIds.includes(id)
      return {
        ...prev,
        amenityIds: exists ? prev.amenityIds.filter(aId => aId !== id) : [...prev.amenityIds, id]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price || !form.areaSqft || !form.locality.trim() || !form.city.trim()) {
      toast.error('Please fill all required fields (Title, Price, Area, Locality, City)')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        listingType: form.listingType,
        price: parseFloat(form.price),
        areaSqft: parseFloat(form.areaSqft),
        builtUpArea: parseFloat(form.areaSqft),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
        balconies: form.balconies ? parseInt(form.balconies, 10) : null,
        floorNumber: form.floorNumber ? parseInt(form.floorNumber, 10) : null,
        totalFloors: form.totalFloors ? parseInt(form.totalFloors, 10) : null,
        furnishingStatus: form.furnishingStatus,
        addressLine: form.addressLine || form.locality,
        locality: form.locality,
        city: form.city,
        state: form.state || 'Maharashtra',
        pincode: form.pincode || '416003',
        amenityIds: form.amenityIds
      }

      const response = await propertyApi.createProperty(payload)
      const propId = response.data?.data?.id || response.data?.id
      toast.success('Property created successfully! Now add photos to complete your listing.')
      if (propId) {
        navigate(`/builder/properties/${propId}/images`)
      } else {
        navigate('/builder/properties')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create property')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Property Listing</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new real estate listing. After creating, you will upload photos and documents.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiHome className="text-indigo-600" /> Basic Property Details
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Property Title *</label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Luxurious 3 BHK Apartment in Tarabai Park"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Property Type</label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="VILLA">Villa / Independent House</option>
                <option value="PLOT">Residential Plot / Land</option>
                <option value="COMMERCIAL">Commercial Office / Shop</option>
                <option value="PENTHOUSE">Penthouse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Listing Type</label>
              <select
                name="listingType"
                value={form.listingType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹ INR) *</label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 7500000"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Highlight property features, ventilation, nearby landmarks, specifications..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiLayers className="text-indigo-600" /> Property Specifications
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bedrooms (BHK)</label>
              <input
                type="number"
                name="bedrooms"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                min="0"
                value={form.bathrooms}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Area (sq.ft) *</label>
              <input
                type="number"
                name="areaSqft"
                required
                min="1"
                value={form.areaSqft}
                onChange={handleChange}
                placeholder="e.g. 1250"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Balconies</label>
              <input
                type="number"
                name="balconies"
                value={form.balconies}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Furnishing Status</label>
              <select
                name="furnishingStatus"
                value={form.furnishingStatus}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Floor No.</label>
              <input
                type="number"
                name="floorNumber"
                value={form.floorNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Total Floors</label>
              <input
                type="number"
                name="totalFloors"
                value={form.totalFloors}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiMapPin className="text-indigo-600" /> Location Details
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Address / Street</label>
            <input
              type="text"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              placeholder="e.g. 102, Royal Enclave, Near Circuit House"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Locality *</label>
              <input
                type="text"
                name="locality"
                required
                value={form.locality}
                onChange={handleChange}
                placeholder="e.g. Tarabai Park"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiCheckCircle className="text-indigo-600" /> Select Amenities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {amenities.map((amenity) => {
              const checked = form.amenityIds.includes(amenity.id)
              return (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-semibold transition ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{amenity.name}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/builder/properties')}
            className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-50 transition shadow-md"
          >
            {saving ? 'Creating Listing...' : 'Create Property & Add Photos →'}
          </button>
        </div>
      </form>
    </div>
  )
}
