import { supabase } from '../lib/supabase';

// Sayfa content tipi — her sayfa için ayrı kullanabilirsin
export interface PageContent<T = any> {
  id: string;
  page: string;
  content: T;
  updated_at: string;
}

export const pageContentService = {
  // Fetch page content by page name (örn: "home", "about", "contact")
  async getPageContent<T>(page: string): Promise<PageContent<T> | null> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page', page)
      .single();
    if (error) {
      console.error('Error fetching page content:', error);
      return null;
    }
    return data as PageContent<T>;
  },

  // Update page content (sayfa ismi ile)
  async updatePageContent<T>(page: string, content: T): Promise<boolean> {
    const { error } = await supabase
      .from('page_content')
      .update({ content })
      .eq('page', page);
    if (error) {
      console.error('Error updating page content:', error);
      return false;
    }
    return true;
  },

  // (Opsiyonel) İlk ekleme - Eğer satır yoksa ekle
  async createPageContent<T>(page: string, content: T): Promise<boolean> {
    const { error } = await supabase
      .from('page_content')
      .insert([{ page, content }]);
    if (error) {
      console.error('Error creating page content:', error);
      return false;
    }
    return true;
  },
};
