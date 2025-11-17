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
  images?: string[];  // ✅ EKLE - Opsiyonel çoklu görseller
  features?: string[];  // ✅ Varsa bu da ekle
  featuresEN?: string[];
  featuresRU?: string[];
  featuresAZ?: string[];
  included?: string[];
  includedEN?: string[];
  includedRU?: string[];
  includedAZ?: string[];
  excluded?: string[];
  excludedEN?: string[];
  excludedRU?: string[];
  excludedAZ?: string[];
  itinerary?: { title: string; description: string }[];
  itineraryEN?: { title: string; description: string }[];
  itineraryRU?: { title: string; description: string }[];
  itineraryAZ?: { title: string; description: string }[];
}

// Tur tipi
export interface Tour {
  id: string;
  created_at?: string;
  
  // Titles
  title_tr: string;
  title_en?: string;
  title_ru?: string;
  title_az?: string;
  
  // Descriptions
  description_tr: string;
  description_en?: string;
  description_ru?: string;
  description_az?: string;
  
  // Basic Info
  location: string;
  price: number;
  duration: string;
  max_group: number;
  is_active: boolean;
  category?: string;  // ✅ EKLE - Opsiyonel
  
  // Images
  images: string[];  // ✅ ARRAY
  image?: string;    // ✅ Eski tek görsel alanı (geriye dönük uyumluluk)
  
  // Features
  features_tr?: string[];
  features_en?: string[];
  features_ru?: string[];
  features_az?: string[];
  
  // Included/Excluded
  included?: string[];  // ✅ EKLE - Eski alan
  excluded?: string[];  // ✅ EKLE - Eski alan
  included_tr?: string[];
  included_en?: string[];
  included_ru?: string[];
  included_az?: string[];
  excluded_tr?: string[];
  excluded_en?: string[];
  excluded_ru?: string[];
  excluded_az?: string[];
  
  // Itinerary
  itinerary_tr?: any;
  itinerary_en?: any;
  itinerary_ru?: any;
  itinerary_az?: any;

  rating?: number;  // ✅ EKLE
  review_count?: number;  // ✅ EKLE

}

export interface Booking {
  id: string;
  tour_id: string;
  customer_name: string;
  email: string;
  phone: string;
  tour_date: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  updated_at?: string;
  
  // İlişkili veriler (join)
  tour?: {
    id: string;
    title_tr: string;
    title_en?: string;
    price: number;
    image?: string;
    duration?: string;
    location?: string;
  };
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
  email?: string;  // ← YENİ
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';  // ← GÜNCELLEME
  featured?: boolean;  // ← YENİ
  created_at: string;
  updated_at?: string;  // ← YENİ
}

export interface HomePageContent {
  hero: {
    backgroundImage: string;
    premiumBadge: string;
    premiumBadgeTR?: string;
    premiumBadgeRU?: string;
    heading1: string;
    heading1TR?: string;
    heading1RU?: string;
    heading2: string;
    heading2TR?: string;
    heading2RU?: string;
    heading3: string;
    heading3TR?: string;
    heading3RU?: string;
    subtitle: string;
    subtitleTR?: string;
    subtitleRU?: string;
    ctaButton1: string;
    ctaButton1TR?: string;
    ctaButton1RU?: string;
    ctaButton2: string;
    ctaButton2TR?: string;
    ctaButton2RU?: string;
    statsCustomers: string;
    statsTours: string;
    statsRating: string;
    statsCustomersLabel: string;
    statsCustomersLabelTR?: string;
    statsCustomersLabelRU?: string;
    statsToursLabel: string;
    statsToursLabelTR?: string;
    statsToursLabelRU?: string;
    statsRatingLabel: string;
    statsRatingLabelTR?: string;
    statsRatingLabelRU?: string;
  };
  
  destinations: {
    sectionTitle: string;
    sectionTitleTR?: string;
    sectionTitleRU?: string;
    sectionSubtitle: string;
    sectionSubtitleTR?: string;
    sectionSubtitleRU?: string;
    destination1Name: string;
    destination1NameTR?: string;
    destination1NameRU?: string;
    destination1Image: string;
    destination2Name: string;
    destination2NameTR?: string;
    destination2NameRU?: string;
    destination2Image: string;
    destination3Name: string;
    destination3NameTR?: string;
    destination3NameRU?: string;
    destination3Image: string;
    destination4Name: string;
    destination4NameTR?: string;
    destination4NameRU?: string;
    destination4Image: string;
  };
  
  featuredTours: {
    sectionTitle: string;
    sectionTitleTR?: string;
    sectionTitleRU?: string;
    sectionSubtitle: string;
    sectionSubtitleTR?: string;
    sectionSubtitleRU?: string;
    viewAllButton: string;
    viewAllButtonTR?: string;
    viewAllButtonRU?: string;
     badgeText: string;           // ✅ EKLE
    detailButtonText: string;    // ✅ EKLE
  };
  
  premiumExperience: {
    badgeText: string;
    sectionTitle: string;
     sliderImages: string[];      // ✅ EKLE - Array
    sliderBadge: string;         // ✅ EKLE
    sliderSubtext: string;       // ✅ EKLE
    sectionTitleTR?: string;
    sectionTitleRU?: string;
    sectionSubtitle: string;
    sectionSubtitleTR?: string;
    sectionSubtitleRU?: string;
    feature1Icon: string;
    sectionImage?: string;
    feature1Title: string;
    feature1TitleTR?: string;
    feature1TitleRU?: string;
    feature1Desc: string;
    feature1DescTR?: string;
    feature1DescRU?: string;
    feature2Icon: string;
    feature2Title: string;
    feature2TitleTR?: string;
    feature2TitleRU?: string;
    feature2Desc: string;
    feature2DescTR?: string;
    feature2DescRU?: string;
    feature3Icon: string;
    feature3Title: string;
    feature3TitleTR?: string;
    feature3TitleRU?: string;
    feature3Desc: string;
    feature3DescTR?: string;
    feature3DescRU?: string;
    feature4Icon: string;
    feature4Title: string;
    feature4TitleTR?: string;
    feature4TitleRU?: string;
    feature4Desc: string;
    feature4DescTR?: string;
    feature4DescRU?: string;
    feature5Icon: string;
    feature5Title: string;
    feature5TitleTR?: string;
    feature5TitleRU?: string;
    feature5Desc: string;
    feature5DescTR?: string;
    feature5DescRU?: string;
    feature6Icon: string;
    feature6Title: string;
    feature6TitleTR?: string;
    feature6TitleRU?: string;
    feature6Desc: string;
    feature6DescTR?: string;
    feature6DescRU?: string;
  };
  
  expertGuides: {
    badgeText: string; 
    sectionTitle: string;
    sectionTitleTR?: string;
    sectionTitleRU?: string;
    sectionSubtitle: string;
    sectionSubtitleTR?: string;
    sectionSubtitleRU?: string;
    guide1Name: string;
    guide1Role: string;
    guide1RoleTR?: string;
    guide1RoleRU?: string;
    guide1Languages: string;
    guide1Experience: string;
    guide1Image: string;
    guide2Name: string;
    guide2Role: string;
    guide2RoleTR?: string;
    guide2RoleRU?: string;
    guide2Languages: string;
    guide2Experience: string;
    guide2Image: string;
    guide3Name: string;
    guide3Role: string;
    guide3RoleTR?: string;
    guide3RoleRU?: string;
    guide3Languages: string;
    guide3Experience: string;
    guide3Image: string;
  };
  
  testimonials: {
    badgeText: string; 
    sectionTitle: string;
    sectionTitleTR?: string;
    sectionTitleRU?: string;
    sectionSubtitle: string;
    sectionSubtitleTR?: string;
    sectionSubtitleRU?: string;
  };
  
  cta: {
   backgroundImage: string;
    badgeText: string;
    title1: string;
    title2: string;
    subtitle: string;
    button1Text: string;
    button2Text: string;
    whatsappLink: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };
}
