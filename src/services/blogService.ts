import { supabase } from '../lib/supabase';

export const blogService = {
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },
  async create(values: any) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([values])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(id: string, values: any) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(values)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*');
    if (error) throw error;
    return data;
  }
};
