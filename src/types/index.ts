// src/types/index.ts
// types/index.ts
// Tur kategorisi tipi
export interface TourCategory {
  id: string;
  name_tr: string;
  name_en: string;
  slug: string;
  description_tr?: string;
  description_en?: string;
  icon?: string;
  order_num?: number;
  is_active?: boolean;
  created_at?: string;
}


export interface TourFormData {
  title: string;
  titleEN: string;
  titleRU: string;
  titleAZ: string;
  description: string;
  descriptionEN: string;
  descriptionRU: string;
  descriptionAZ: string;
  category: string;
  price: number | string;
  duration: string;
  capacity: number;
  status: 'active' | 'inactive';
  location: string;
  image?: string;
}

// Tur tipi
export interface Tour {
  id: string;
  title_tr: string;
  title_en: string;
  title_ru: string;
  title_az: string;
  description_tr: string;
  description_en: string;
  description_ru: string;
  description_az: string;
  price: string;
  duration: string;
  max_group: number;
  category: string;
  location: string;
  images: string[];
  features_tr: string[];
  features_en: string[];
  features_ru: string[];
  features_az: string[];
  itinerary_tr: string | null;
  itinerary_en: string | null;
  itinerary_ru: string | null;
  itinerary_az: string | null;
  included: string[];
  excluded: string[];
  is_active: boolean;
  created_at?: string;
   cover?: string;
}




export interface Booking {
  id: string;
  tour_id: string;
  tour?: Tour;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  number_of_people: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_az: string;
  title_en: string;
  title_ru: string;
  excerpt_az: string;
  excerpt_en: string;
  excerpt_ru: string;
  content_az: string;
  content_en: string;
  content_ru: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
  status: 'draft' | 'published';
}

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_ru: string;
  name_az: string;
  slug: string;
  icon: string;
  description_tr?: string;
  description_en?: string;
  description_ru?: string;
  description_az?: string;
  order_num: number;
  status: 'active' | 'inactive';
}



export interface Review {
  id: string;
  tour_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}