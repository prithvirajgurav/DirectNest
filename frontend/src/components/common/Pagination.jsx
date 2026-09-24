import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(0, page - 2)
  const end = Math.min(totalPages - 1, page + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      {start > 0 && (
        <>
          <button onClick={() => onPageChange(0)} className="px-3 py-1 rounded-lg hover:bg-gray-100">1</button>
          {start > 1 && <span className="px-1">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-lg ${p === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
        >
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span className="px-1">...</span>}
          <button onClick={() => onPageChange(totalPages - 1)} className="px-3 py-1 rounded-lg hover:bg-gray-100">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
