import { Link } from 'react-router-dom'
import type { Tour } from '../../types'

interface TourCardProps {
  tour: Tour
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
     <img 
  src={tour.image || 'https://via.placeholder.com/400x300'} 
  alt={tour.title_tr} 
  className="w-full h-48 object-cover"
/>
      <div className="p-6">
        <span className="text-xs bg-primary text-white px-2 py-1 rounded">{tour.category}</span>
        <h3 className="text-xl font-semibold mt-2 mb-2">{tour.title_tr}</h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-600">{tour.duration}</span>
          <span className="text-2xl font-bold text-primary">${tour.price}</span>
        </div>
        <Link 
          to={`/tour/${tour.id}`}
          className="block w-full mt-4 bg-secondary text-white py-2 rounded text-center hover:bg-opacity-90 transition"
        >
          Detaylar
        </Link>
      </div>
    </div>
  )
}
