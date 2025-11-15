import { supabase } from '../lib/supabase';
import type { Tour } from '../types';

export const tourService = {
  async getAllTours(): Promise<Tour[]> {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getTourById(id: string): Promise<Tour | null> {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createTour(tour: Omit<Tour, 'id' | 'created_at'>): Promise<Tour> {
    const { data, error } = await supabase
      .from('tours')
      .insert([tour])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateTour(id: string, updates: Partial<Tour>): Promise<Tour> {
    const { data, error } = await supabase
      .from('tours')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteTour(id: string): Promise<void> {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
