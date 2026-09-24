import { FiAlertCircle } from 'react-icons/fi'

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="text-center py-12">
      <FiAlertCircle className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Error</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 btn-primary">
          Try Again
        </button>
      )}
    </div>
  )
}
