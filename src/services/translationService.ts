// Basit çeviri servisi - Google Translate API veya LibreTranslate kullanabilirsin
// Şimdilik mock olarak veriyorum, sonra gerçek API'ye bağlayabilirsin

interface TranslateRequest {
  text: string;
  targetLang: 'tr' | 'ru';
}

export const translationService = {
  async translate(text: string, targetLang: 'tr' | 'ru'): Promise<string> {
    try {
      // ÖNEMLİ: Buraya gerçek API entegrasyonu eklenecek
      // Şimdilik basit bir örnek:
      
      // Seçenek 1: Google Translate API (ücretli ama kaliteli)
      // const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     q: text,
      //     source: 'az',
      //     target: targetLang,
      //     format: 'text'
      //   })
      // });
      
      // Seçenek 2: LibreTranslate (ücretsiz, self-hosted)
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'az',
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        console.error('Translation failed');
        return text; // Hata durumunda orijinal metni döndür
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Hata durumunda orijinal metni döndür
    }
  },

  // Tüm içeriği çevir
  async translateContent(content: any): Promise<any> {
    const translated = { ...content };

    // Her section için çeviri yap
    for (const section in content) {
      for (const field in content[section]) {
        const value = content[section][field];
        
        // Sadece string değerleri çevir (URL ve ikon isimlerini atla)
        if (typeof value === 'string' && 
            !field.includes('Image') && 
            !field.includes('Icon') && 
            !field.includes('TR') && 
            !field.includes('RU')) {
          
          // Türkçe çeviri
          translated[section][field + 'TR'] = await this.translate(value, 'tr');
          
          // Rusça çeviri
          translated[section][field + 'RU'] = await this.translate(value, 'ru');
        }
      }
    }

    return translated;
  }
};
