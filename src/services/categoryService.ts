import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export const categoryService = {
  async getAll(tableName: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('order_num', { ascending: true }); // <-- BURADA order_num!
    if (error) throw error;
    return data || [];
  },
  async create(tableName: string, category: Omit<Category, 'id'>) {
    const { data, error } = await supabase
      .from(tableName)
      .insert([category])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(tableName: string, id: string, updates: Partial<Category>) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async delete(tableName: string, id: string) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
