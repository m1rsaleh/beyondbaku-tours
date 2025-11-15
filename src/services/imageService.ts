import { supabase } from '../lib/supabase';

export const imageService = {
  async upload(file: File, path: string = 'gallery'): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase
      .storage
      .from(path)
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase
      .storage
      .from(path)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },
  // Gelişmiş için:
  async delete(fileName: string, path: string = 'gallery') {
    const { error } = await supabase
      .storage
      .from(path)
      .remove([fileName]);
    if (error) throw error;
  }
};
