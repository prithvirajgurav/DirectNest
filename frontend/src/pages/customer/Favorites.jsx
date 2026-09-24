import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiSearch } from 'react-icons/fi'
import { favoriteApi } from '../../api/favoriteApi'
import PropertyGrid from '../../components/property/PropertyGrid'
import { toast } from 'react-toastify'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await favoriteApi.getUserFavorites({ page: 0, size: 50 })
      const raw = response.data?.data || response.data
      const list = raw?.content || (Array.isArray(raw) ? raw : [])
      const mapped = list.map((item) => (item.property ? { ...item.property, favoriteId: item.id } : item))
      setFavorites(mapped)
    } catch (error) {
      console.error('Failed to load favorites:', error)
      toast.error('Failed to load favorite properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Saved Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            You have {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition"
        >
          <FiSearch className="h-4 w-4" />
          Find More Properties
        </Link>
      </div>

      <PropertyGrid properties={favorites} loading={loading} />
    </div>
  )
}
