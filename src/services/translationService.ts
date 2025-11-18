// MyMemory API kullanıyoruz (ücretsiz, CORS yok, limit: 1000 karakter/istek)

export const translationService = {
  async translate(text: string, targetLang: 'en' | 'ru' | 'az'): Promise<string> {
    if (!text || text.trim() === '') return '';

    // Çok uzun metinleri kes
    const maxLength = 900;
    const textToTranslate = text.length > maxLength ? text.substring(0, maxLength) : text;

    try {
      // MyMemory Translation API (ücretsiz, CORS yok)
      const sourceLang = 'tr'; // Türkçe'den
      const langPair = `${sourceLang}|${targetLang}`;
      
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${langPair}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText || text;
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Hata olursa orijinal metni döndür
    }
  },

  // Birden fazla metin çevir (sırayla)
  async translateMultiple(texts: string[], targetLang: 'en' | 'ru' | 'az'): Promise<string[]> {
    const results: string[] = [];
    
    for (const text of texts) {
      const translated = await this.translate(text, targetLang);
      results.push(translated);
      // Rate limit için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }
};
