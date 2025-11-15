import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
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
  price: number;
  duration: string;
  max_group: number;
  category: string;
  location: string;
  images: string[];
  features_tr: string[];
  features_en: string[];
  features_ru: string[];
  features_az: string[];
  itinerary_tr: any;
  itinerary_en: any;
  itinerary_ru: any;
  itinerary_az: any;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  tour_id: string;
  customer_name: string;
  email: string;
  phone: string;
  tour_date: string;
  guests: number;
  language: string;
  special_requests: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  tour_id: string | null;
  customer_name: string;
  review_tr: string | null;
  review_en: string | null;
  rating: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title_tr: string;
  title_en: string;
  title_ru: string;
  title_az: string;
  slug_tr: string;
  slug_en: string;
  slug_ru: string;
  slug_az: string;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  excerpt_az: string | null;
  content_tr: string;
  content_en: string;
  content_ru: string;
  content_az: string;
  category_id: string | null;
  featured_image: string | null;
  author: string;
  status: 'draft' | 'published';
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}