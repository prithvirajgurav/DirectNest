import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiUploadCloud, FiTrash2, FiFileText, FiArrowLeft, FiFile } from 'react-icons/fi'
import { propertyApi } from '../../api/propertyApi'
import { toast } from 'react-toastify'

export default function PropertyDocuments() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('APPROVED_PLAN')
  const [selectedFile, setSelectedFile] = useState(null)

  const fetchPropertyData = async () => {
    setLoading(true)
    try {
      const response = await propertyApi.getById(id)
      const propData = response.data?.data || response.data
      setProperty(propData)
      setDocuments(propData?.documents || [])
    } catch (error) {
      console.error('Failed to load property documents:', error)
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
      toast.error('Please select a document file to upload')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('documentType', docType)

      await propertyApi.uploadPropertyDocument(id, formData)
      toast.success('Document uploaded successfully!')
      setSelectedFile(null)
      fetchPropertyData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to remove this document?')) return

    try {
      await propertyApi.deletePropertyDocument(id, docId)
      toast.success('Document removed')
      fetchPropertyData()
    } catch (error) {
      toast.error('Failed to delete document')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading documents...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          to="/builder/properties"
          className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 mb-2"
        >
          <FiArrowLeft /> Back to My Properties
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Legal Documents for #{id}</h1>
        <p className="text-sm text-gray-500">{property?.title}</p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FiUploadCloud className="text-indigo-600" /> Upload Verification Document
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="APPROVED_PLAN">Approved Sanctioned Building Plan</option>
                <option value="OCCUPANCY_CERTIFICATE">Occupancy Certificate (OC)</option>
                <option value="COMMENCEMENT_CERTIFICATE">Commencement Certificate (CC)</option>
                <option value="TITLE_DEED">Title Deed / 7/12 Extract</option>
                <option value="RERA_APPROVAL">RERA Project Approval</option>
                <option value="OTHER">Other Compliance Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select File (PDF / Images)</label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">Uploaded Documents ({documents.length})</h2>

        {documents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiFile className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{doc.documentType}</span>
                    <span className="text-xs text-gray-400 block">
                      Uploaded on {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'recently'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View File
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Document"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiFileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No documents attached to this property.</p>
          </div>
        )}
      </div>
    </div>
  )
}
