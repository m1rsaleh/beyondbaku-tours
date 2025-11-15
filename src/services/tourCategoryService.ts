import { supabase } from '../lib/supabase';
import type { TourCategory } from '../types';

export const tourCategoryService = {
  async getAllCategories(): Promise<TourCategory[]> {
    const { data, error } = await supabase
      .from('tour_categories')
      .select('*')
      .order('order_num', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  async createCategory(category: Omit<TourCategory, 'id' | 'created_at'>): Promise<TourCategory> {
    const { data, error } = await supabase
      .from('tour_categories')
      .insert([category])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async updateCategory(id: string, updates: Partial<TourCategory>): Promise<TourCategory> {
    const { data, error } = await supabase
      .from('tour_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('tour_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
