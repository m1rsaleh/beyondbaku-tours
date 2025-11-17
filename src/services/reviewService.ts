import { supabase } from '../lib/supabase';
import type { Review } from '../types';

export const reviewService = {
  // Tura göre ONAYLANMIŞ yorumları getir
  async getReviewsByTourId(tour_id: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tour_id', tour_id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Yorumlar getirilemedi:', error);
      return [];
    }
    return data || [];
  },

  // TÜM yorumları getir (Admin)
  async getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        tour:tours(title_tr)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Yorumlar getirilemedi:', error);
      return [];
    }
    return data || [];
  },

  // ✅ YORUM EKLE - EmailJS YOK!
async createReview(review: Omit<Review, 'id' | 'created_at' | 'status'>): Promise<Review | null> {
  // 🔍 DEBUG: Hangi user role?
  const { data: { user } } = await supabase.auth.getUser();
  console.log('🔵 Current user:', user);
  console.log('🔵 Is authenticated:', !!user);

  const insertData = {
    tour_id: review.tour_id,
    customer_name: review.customer_name,
    email: review.email,
    rating: review.rating,
    comment: review.comment,
    status: 'pending',
    featured: false
  };

  console.log('🔵 Inserting:', insertData);

  const { data, error } = await supabase
    .from('reviews')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return null;
  }

  console.log('✅ Success:', data);
  return data;
},


  // Yorum durumunu güncelle (Admin)
  async updateReviewStatus(id: string, status: Review['status']): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Durum güncellenemedi:', error);
      return false;
    }
    return true;
  },

  // Featured toggle (Admin)
  async toggleFeatured(id: string, featured: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .update({ 
        featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Featured güncellenemedi:', error);
      return false;
    }
    return true;
  },

  // Yorum sil (Admin)
  async deleteReview(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Yorum silinemedi:', error);
      return false;
    }
    return true;
  },

  // İstatistikler (Admin)
  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avgRating: number;
  }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, status');
    
    if (error || !data) {
      return { total: 0, pending: 0, approved: 0, rejected: 0, avgRating: 0 };
    }

    const total = data.length;
    const pending = data.filter(r => r.status === 'pending').length;
    const approved = data.filter(r => r.status === 'approved').length;
    const rejected = data.filter(r => r.status === 'rejected').length;
    const avgRating = total > 0 
      ? Math.round((data.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
      : 0;

    return { total, pending, approved, rejected, avgRating };
  },

  // Öne çıkan yorumlar (Ana sayfa için)
  async getFeaturedReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .eq('featured', true)
      .order('created_at', { ascending: false})
      .limit(6);
    
    if (error) {
      console.error('Featured yorumlar getirilemedi:', error);
      return [];
    }
    return data || [];
  }
};
