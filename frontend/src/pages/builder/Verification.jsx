import { useState, useEffect } from 'react'
import { FiShield, FiUploadCloud, FiFile, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2 } from 'react-icons/fi'
import { builderApi } from '../../api/builderApi'
import { toast } from 'react-toastify'

export default function Verification() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('RERA_CERTIFICATE')
  const [selectedFile, setSelectedFile] = useState(null)

  const fetchVerificationData = async () => {
    setLoading(true)
    try {
      const profRes = await builderApi.getProfile()
      const profileData = profRes.data?.data || profRes.data
      setProfile(profileData)

      try {
        const docsRes = await builderApi.getDocuments()
        const docsData = docsRes.data?.data || docsRes.data || profileData?.documents || []
        setDocuments(Array.isArray(docsData) ? docsData : [])
      } catch (e) {
        if (profileData?.documents) {
          setDocuments(profileData.documents)
        }
      }
    } catch (err) {
      console.error('Failed to load verification status:', err)
      toast.error('Failed to load verification details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVerificationData()
  }, [])

  const handleFileUpload = async (e) => {
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

      await builderApi.uploadDocument(formData)
      toast.success('Document uploaded successfully!')
      setSelectedFile(null)
      fetchVerificationData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to remove this verification document?')) return
    try {
      await builderApi.deleteDocument(docId)
      toast.success('Document removed')
      fetchVerificationData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete document')
    }
  }

  const handleSubmitVerification = async () => {
    try {
      await builderApi.submitVerification()
      toast.success('Verification submitted for review!')
      fetchVerificationData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit verification request')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading verification details...</div>
  }

  const status = profile?.verificationStatus || 'PENDING'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Builder Verification</h1>
        <p className="text-sm text-gray-500 mt-1">
          Verify your business credentials to gain verified partner status and publish listings
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className={`p-6 rounded-2xl border ${
        status === 'APPROVED' || status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-200' :
        status === 'PENDING_VERIFICATION' || status === 'PENDING' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
      }`}>
        <div className="flex items-center gap-4">
          {status === 'APPROVED' || status === 'VERIFIED' ? (
            <FiCheckCircle className="h-8 w-8 text-emerald-600 shrink-0" />
          ) : status === 'PENDING_VERIFICATION' || status === 'PENDING' ? (
            <FiClock className="h-8 w-8 text-amber-600 shrink-0" />
          ) : (
            <FiAlertCircle className="h-8 w-8 text-rose-600 shrink-0" />
          )}
          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              Status: <span className="uppercase">{status}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {status === 'APPROVED' || status === 'VERIFIED'
                ? 'Your builder credentials have been verified by DirectNest. All your approved listings are live.'
                : status === 'PENDING_VERIFICATION' || status === 'PENDING'
                ? 'Your documents are under review by our moderation team. You will be notified once approved.'
                : 'Your verification request was rejected. Please upload updated credentials below.'}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Document Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-900 text-base">Upload Verification Documents</h3>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="RERA_CERTIFICATE">RERA Certificate</option>
                <option value="BUSINESS_REGISTRATION">Business Registration / GSTIN</option>
                <option value="IDENTITY_PROOF">ID Proof (Aadhaar / PAN)</option>
                <option value="ADDRESS_PROOF">Address Proof</option>
                <option value="OTHER">Other Supporting Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Select File (PDF / Image)</label>
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
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <FiUploadCloud className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base mb-4">Uploaded Verification Records</h3>
        {documents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiFile className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{doc.documentType}</div>
                    <span className="text-xs text-gray-400">
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
                    View Document →
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete document"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
        )}

        {status !== 'APPROVED' && status !== 'VERIFIED' && documents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleSubmitVerification}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition"
            >
              Submit for Admin Verification
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
