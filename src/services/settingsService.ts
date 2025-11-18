import { supabase } from '../lib/supabase';
import type { GeneralSettings, ContactSettings, SocialSettings } from '../types';

export const settingsService = {
  // Tüm ayarları getir
  async getAllSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('category');

    if (error) throw error;
    return data || [];
  },

  // Belirli bir kategoriyi getir
  async getSettingsByKey(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) throw error;
    return data;
  },

  // Ayarları güncelle
  async updateSettings(key: string, value: GeneralSettings | ContactSettings | SocialSettings, category: string) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        category,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
