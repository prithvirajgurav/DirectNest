import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSliders, FiX, FiSearch } from 'react-icons/fi'
import PropertyGrid from '../../components/property/PropertyGrid'
import FilterPanel from '../../components/property/FilterPanel'
import propertyApi from '../../api/propertyApi'
import { toast } from 'react-toastify'

export default function PropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Parse filters from URL searchParams
  const getFiltersFromParams = () => {
    const filters = {}
    if (searchParams.get('query')) filters.query = searchParams.get('query')
    if (searchParams.get('city')) filters.city = searchParams.get('city')
    if (searchParams.get('locality')) filters.locality = searchParams.get('locality')
    if (searchParams.get('propertyType')) filters.propertyType = searchParams.get('propertyType')
    if (searchParams.get('listingType')) filters.listingType = searchParams.get('listingType')
    if (searchParams.get('minPrice')) filters.minPrice = searchParams.get('minPrice')
    if (searchParams.get('maxPrice')) filters.maxPrice = searchParams.get('maxPrice')
    if (searchParams.get('bedrooms')) filters.bedrooms = searchParams.get('bedrooms')
    if (searchParams.get('furnishingStatus')) filters.furnishingStatus = searchParams.get('furnishingStatus')
    if (searchParams.get('providerType')) filters.providerType = searchParams.get('providerType')
    if (searchParams.get('featured')) filters.featured = searchParams.get('featured') === 'true'

    const rawAmenityIds = searchParams.get('amenityIds')
    if (rawAmenityIds) {
      filters.amenityIds = rawAmenityIds
        .split(',')
        .map(Number)
        .filter((n) => !isNaN(n) && n > 0)
    }
    return filters
  }

  const [filters, setFilters] = useState(getFiltersFromParams())

  useEffect(() => {
    const parsed = getFiltersFromParams()
    setFilters(parsed)
    if (parsed.query) {
      setSearchTerm(parsed.query)
    }
  }, [searchParams])

  const fetchProperties = async (page = 0) => {
    setLoading(true)
    try {
      const activeFilters = getFiltersFromParams()
      const params = {
        ...activeFilters,
        page,
        size: 12,
        sortBy,
        sortDir
      }

      // If amenityIds is an array, pass as comma-separated or array
      if (Array.isArray(params.amenityIds) && params.amenityIds.length > 0) {
        params.amenityIds = params.amenityIds.join(',')
      } else {
        delete params.amenityIds
      }

      const response = await propertyApi.search(params)
      const data = response.data?.data || response.data
      setProperties(data?.content || (Array.isArray(data) ? data : []))
      setTotalElements(data?.totalElements || 0)
      setTotalPages(data?.totalPages || 0)
      setCurrentPage(data?.page !== undefined ? data.page : (data?.number || 0))
    } catch (error) {
      console.error('Failed to search properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(0)
  }, [searchParams, sortBy, sortDir])

  const handleFilterChange = (newFilters) => {
    const updated = { ...newFilters }
    const params = new URLSearchParams()

    Object.keys(updated).forEach((key) => {
      const val = updated[key]
      if (val !== '' && val !== null && val !== undefined) {
        if (key === 'amenityIds' && Array.isArray(val)) {
          if (val.length > 0) {
            params.set('amenityIds', val.join(','))
          }
        } else {
          params.set(key, String(val))
        }
      }
    })

    setSearchParams(params)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleFilterChange({ ...filters, query: searchTerm })
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSearchParams({})
  }

  const activeFiltersCount = Object.keys(filters).filter((k) => {
    if (k === 'amenityIds') return filters[k]?.length > 0
    return Boolean(filters[k])
  }).length

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search & Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {filters.city ? `Properties in ${filters.city}` : 'Explore Verified Properties'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing {properties.length} of {totalElements} verified listing{totalElements === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search title, locality, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field text-sm py-2 pl-9 pr-8 w-64 md:w-72 bg-white"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    handleFilterChange({ ...filters, query: '' })
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <FiSliders className="h-4 w-4 text-primary-600" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">
                Sort:
              </span>
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-')
                  setSortBy(field)
                  setSortDir(dir)
                }}
                className="bg-white border border-gray-300 text-gray-800 text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="areaSqft-asc">Area: Low to High</option>
                <option value="areaSqft-desc">Area: High to Low</option>
                <option value="viewsCount-desc">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Filters Sidebar + Property Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
              <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-800 text-xl font-bold p-1"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onFilterChange={(f) => {
                    handleFilterChange(f)
                    setMobileFilterOpen(false)
                  }}
                  onReset={() => {
                    handleResetFilters()
                    setMobileFilterOpen(false)
                  }}
                />
              </div>
            </div>
          )}

          {/* Properties Result Column */}
          <div className="lg:col-span-3">
            <PropertyGrid properties={properties} loading={loading} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => fetchProperties(currentPage - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchProperties(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition shadow-sm ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => fetchProperties(currentPage + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
