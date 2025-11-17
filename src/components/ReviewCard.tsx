import { Star } from 'lucide-react';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // İsmin baş harfini al
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Random background renkleri
  const bgColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];

  // İsme göre sabit bir renk seç (aynı isim hep aynı renk)
  const getBgColor = (name: string) => {
    const index = name.charCodeAt(0) % bgColors.length;
    return bgColors[index];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start gap-4">
        {/* Avatar - Baş Harf */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${getBgColor(
            review.customer_name
          )}`}
        >
          {getInitial(review.customer_name)}
        </div>

        {/* Yorum İçeriği */}
        <div className="flex-1">
          {/* İsim ve Tarih */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">
              {review.customer_name}
            </h4>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>

          {/* Yıldızlar */}
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Yorum Metni */}
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
