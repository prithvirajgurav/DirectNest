import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiUploadCloud, FiTrash2, FiStar, FiArrowLeft, FiImage } from 'react-icons/fi'
import { propertyApi } from '../../api/propertyApi'
import { toast } from 'react-toastify'

export default function PropertyImages() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isPrimary, setIsPrimary] = useState(false)

  const fetchPropertyData = async () => {
    setLoading(true)
    try {
      const response = await propertyApi.getById(id)
      const propData = response.data?.data || response.data
      setProperty(propData)
      setImages(propData?.images || [])
    } catch (error) {
      console.error('Failed to load property images:', error)
      toast.error('Property not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPropertyData()
  }, [id])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Please select an image file to upload')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('isPrimary', isPrimary || images.length === 0)

      await propertyApi.uploadPropertyImage(id, formData)
      toast.success('Image uploaded successfully!')
      setSelectedFile(null)
      setIsPrimary(false)
      fetchPropertyData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSetPrimary = async (imageId) => {
    try {
      await propertyApi.setPrimaryImage(id, imageId)
      toast.success('Primary cover image updated')
      fetchPropertyData()
    } catch (error) {
      toast.error('Failed to update primary image')
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return

    try {
      await propertyApi.deletePropertyImage(id, imageId)
      toast.success('Photo removed')
      fetchPropertyData()
    } catch (error) {
      toast.error('Failed to delete photo')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading photos...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/builder/properties"
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 mb-2"
          >
            <FiArrowLeft /> Back to My Properties
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Photos for #{id}</h1>
          <p className="text-sm text-gray-500">{property?.title}</p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FiUploadCloud className="text-indigo-600" /> Upload New Photo
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select Image File (JPG, PNG, WebP)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Set as primary cover photo</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>

      {/* Existing Images Gallery */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">Current Listing Photos ({images.length})</h2>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                <img
                  src={img.imageUrl}
                  alt="Property"
                  className="w-full h-full object-cover"
                />

                {(img.primary || img.primaryImage) && (
                  <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    Cover
                  </span>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  {!(img.primary || img.primaryImage) && (
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      className="p-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 shadow"
                      title="Make Cover Image"
                    >
                      <FiStar className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 shadow"
                    title="Delete Image"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiImage className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No photos uploaded for this property yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
