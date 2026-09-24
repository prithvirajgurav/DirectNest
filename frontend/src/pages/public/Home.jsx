import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiCheckCircle, FiShield, FiUsers, FiHome, FiArrowRight } from 'react-icons/fi'
import SearchBar from '../../components/property/SearchBar'
import PropertyCard from '../../components/property/PropertyCard'
import propertyApi from '../../api/propertyApi'
import { toast } from 'react-toastify'

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await propertyApi.search({ page: 0, size: 6 })
        const data = response.data?.data || response.data
        setFeaturedProperties(data?.content || (Array.isArray(data) ? data : []))
      } catch (error) {
        console.error('Failed to fetch featured properties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const features = [
    {
      icon: <FiShield className="h-8 w-8" />,
      title: 'Verified Properties',
      description: 'Every property and builder is verified by our team before listing'
    },
    {
      icon: <FiUsers className="h-8 w-8" />,
      title: 'Direct Connection',
      description: 'Connect directly with verified builders and property owners'
    },
    {
      icon: <FiCheckCircle className="h-8 w-8" />,
      title: 'Zero Brokerage',
      description: 'No middlemen, no hidden fees. Save money on brokerage'
    },
    {
      icon: <FiHome className="h-8 w-8" />,
      title: 'Wide Selection',
      description: 'Browse apartments, villas, plots, and commercial properties'
    }
  ]

  const popularSearches = [
    { label: '1 BHK Flats', params: { propertyType: 'APARTMENT', minBeds: 1, maxBeds: 1 } },
    { label: '2 BHK Flats', params: { propertyType: 'APARTMENT', minBeds: 2, maxBeds: 2 } },
    { label: '3 BHK Flats', params: { propertyType: 'APARTMENT', minBeds: 3, maxBeds: 3 } },
    { label: 'Villas', params: { propertyType: 'VILLA' } },
    { label: 'Plots', params: { propertyType: 'PLOT' } },
    { label: 'Ready to Move', params: { possessionStatus: 'READY_TO_MOVE' } }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Find Property. <br />
              <span className="text-yellow-300">Connect Directly.</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto">
              DirectNest connects you directly with verified builders and property owners.
              <span className="block mt-2 font-semibold">Zero brokerage. 100% verified properties.</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* Popular Searches */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-indigo-200 mr-2">Popular:</span>
            {popularSearches.map((search, idx) => (
              <Link
                key={idx}
                to={`/properties?${new URLSearchParams(search.params).toString()}`}
                className="text-sm px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition"
              >
                {search.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DirectNest?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a smarter way to find your dream property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600">Handpicked properties from verified builders</p>
            </div>
            <Link
              to="/properties"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="mt-8 text-center md:hidden">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  View All Properties
                  <FiArrowRight />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FiHome className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of happy customers who found their perfect home on DirectNest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition shadow-lg"
            >
              <FiSearch />
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-700 text-white font-bold hover:bg-indigo-800 border-2 border-white/20 transition"
            >
              Register as Builder
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
