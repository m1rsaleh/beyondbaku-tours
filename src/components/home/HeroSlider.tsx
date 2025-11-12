import { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const destinations = [
  {
    name: 'Bakü',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  },
  {
    name: 'Quba',
    image: 'https://images.unsplash.com/photo-1614607242094-b1b2369cc942?w=800',
  },
  {
    name: 'Şəki',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  }
]

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
  }

  // Get 3 consecutive items for display
  const getVisibleItems = () => {
    const items = []
    for (let i = 0; i < 3; i++) {
      items.push(destinations[(currentIndex + i) % destinations.length])
    }
    return items
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Azerbaycan Şehir Turları
          </h1>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition"
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {getVisibleItems().map((dest, index) => (
              <div
                key={index}
                className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-white text-3xl font-bold">{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
