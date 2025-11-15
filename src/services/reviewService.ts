// src/services/reviewService.ts
import { supabase } from '../lib/supabase';
import type { Review } from '../types';

export const reviewService = {
  async getReviewsByTourId(tour_id: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tour_id', tour_id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Yorum eklemek istersen:
  async createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
