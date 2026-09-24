import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FiHome, FiDollarSign, FiMapPin, FiCheckCircle, FiLayers, FiImage, FiFileText } from 'react-icons/fi'
import { propertyApi } from '../../api/propertyApi'
import { amenityApi } from '../../api/amenityApi'
import { toast } from 'react-toastify'

export default function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [propertyStatus, setPropertyStatus] = useState('')

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
    const fetchData = async () => {
      setLoading(true)
      try {
        const [amenitiesRes, propRes] = await Promise.all([
          amenityApi.getAll(),
          propertyApi.getById(id)
        ])

        const amData = amenitiesRes.data?.data || amenitiesRes.data || []
        setAmenities(Array.isArray(amData) ? amData : [])

        const p = propRes.data?.data || propRes.data
        if (p) {
          setPropertyStatus(p.status)

          setForm({
            title: p.title || '',
            description: p.description || '',
            propertyType: p.propertyType || 'APARTMENT',
            listingType: p.listingType || 'SALE',
            price: p.price !== undefined && p.price !== null ? p.price.toString() : '',
            areaSqft: p.areaSqft || p.builtUpArea || '',
            carpetArea: p.carpetArea || '',
            bedrooms: p.bedrooms !== undefined && p.bedrooms !== null ? p.bedrooms.toString() : '2',
            bathrooms: p.bathrooms !== undefined && p.bathrooms !== null ? p.bathrooms.toString() : '2',
            balconies: p.balconies !== undefined && p.balconies !== null ? p.balconies.toString() : '1',
            furnishingStatus: p.furnishingStatus || p.furnishing || 'UNFURNISHED',
            floorNumber: p.floorNumber !== undefined && p.floorNumber !== null ? p.floorNumber.toString() : '0',
            totalFloors: p.totalFloors !== undefined && p.totalFloors !== null ? p.totalFloors.toString() : '1',
            addressLine: p.addressLine || p.address || '',
            locality: p.locality || '',
            city: p.city || '',
            state: p.state || '',
            pincode: p.pincode || '',
            amenityIds: p.amenities ? p.amenities.map(a => typeof a === 'object' ? a.id : a) : []
          })
        }
      } catch (error) {
        console.error('Failed to load property:', error)
        toast.error('Property not found')
        navigate('/builder/properties')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAmenityToggle = (amenityId) => {
    setForm(prev => {
      const exists = prev.amenityIds.includes(amenityId)
      return {
        ...prev,
        amenityIds: exists ? prev.amenityIds.filter(aId => aId !== amenityId) : [...prev.amenityIds, amenityId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        listingType: form.listingType,
        price: parseFloat(form.price),
        areaSqft: form.areaSqft ? parseFloat(form.areaSqft) : null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
        balconies: form.balconies ? parseInt(form.balconies, 10) : null,
        floorNumber: form.floorNumber ? parseInt(form.floorNumber, 10) : null,
        totalFloors: form.totalFloors ? parseInt(form.totalFloors, 10) : null,
        furnishingStatus: form.furnishingStatus,
        addressLine: form.addressLine || form.locality,
        locality: form.locality,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        amenityIds: form.amenityIds
      }

      await propertyApi.updateProperty(id, payload)
      toast.success('Property updated successfully!')
      navigate('/builder/properties')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update property')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    try {
      await propertyApi.submitProperty(id)
      toast.success('Property submitted for admin review and verification!')
      setPropertyStatus('PENDING_VERIFICATION')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit for review')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading property details...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Property #{id}</h1>
          <p className="text-sm text-gray-500 mt-1">Status: <strong className="uppercase">{propertyStatus}</strong></p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/builder/properties/${id}/images`}
            className="px-3.5 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1.5"
          >
            <FiImage className="h-4 w-4" /> Manage Photos
          </Link>
          <Link
            to={`/builder/properties/${id}/documents`}
            className="px-3.5 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5"
          >
            <FiFileText className="h-4 w-4" /> Documents
          </Link>
          {(propertyStatus === 'DRAFT' || propertyStatus === 'REJECTED') && (
            <button
              onClick={handleSubmitForReview}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Submit for Approval
            </button>
          )}
        </div>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">Area (sq.ft)</label>
              <input
                type="number"
                name="areaSqft"
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
            {saving ? 'Saving...' : 'Save Property Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
