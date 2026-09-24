import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function PropertyGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80'

  const imageList = images && images.length > 0
    ? images.map((img) => {
        if (!img) return defaultImage
        if (typeof img === 'string') return img
        return img.imageUrl || img.filePath || img.url || defaultImage
      })
    : [defaultImage]

  const getFullSrc = (path) => {
    if (!path) return defaultImage
    if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
      return path
    }
    return `/uploads/${path}`
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))
  }

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 group shadow-md">
        <img
          src={getFullSrc(imageList[currentIndex])}
          alt={`Property image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => { e.target.src = defaultImage }}
        />

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {currentIndex + 1} / {imageList.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[16/10] w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-primary-600 ring-2 ring-primary-100' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getFullSrc(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultImage }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
