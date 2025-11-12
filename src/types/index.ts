export interface Tour {
  id: string
  title_tr: string
  title_en: string
  title_az: string
  description_tr: string
  description_en: string
  description_az: string
  location: string
  price: number
  duration: string
  max_group: number
  category: string
  images: string[]
  is_active: boolean
  created_at?: string  // OPTIONAL YAP
  
  // Optional fields
  highlights?: string[]
  itinerary?: Array<{
    title: string
    description: string
  }>
  included?: string[]
  excluded?: string[]
}


export interface Booking {
  tour_id: string
  customer_name: string
  email: string
  phone: string
  tour_date: string
  guests: number
  language?: string
  special_requests?: string
  total_price?: number
}

