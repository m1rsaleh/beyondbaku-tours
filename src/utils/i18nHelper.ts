import i18n from 'i18next';

/**
 * Backend'den gelen çok dilli alanlardan doğru dili seçer
 * Örnek: getLocalizedField(tour, 'title') -> title_az veya title_en döner
 */
export function getLocalizedField<T>(
  item: any,
  fieldName: string,
  fallback: string = ''
): T {
  const lang = i18n.language || 'az'; // Varsayılan dil AZ
  
  // Önce mevcut dil için dene
  const field = `${fieldName}_${lang}`;
  if (item && item[field]) {
    return item[field] as T;
  }
  
  // Fallback sırası: az -> en -> ru -> tr
  const fallbackLangs = ['az', 'en', 'ru', 'tr'];
  for (const fallbackLang of fallbackLangs) {
    const fallbackField = `${fieldName}_${fallbackLang}`;
    if (item && item[fallbackField]) {
      return item[fallbackField] as T;
    }
  }
  
  // Hiçbir dil yoksa varsayılan değer
  return (item?.[fieldName] || fallback) as T;
}

/**
 * Array alanlarda kullanım (features, included, excluded vb.)
 */
export function getLocalizedArray(item: any, fieldName: string): string[] {
  const lang = i18n.language || 'az';
  const field = `${fieldName}_${lang}`;
  
  if (item && Array.isArray(item[field]) && item[field].length > 0) {
    return item[field];
  }
  
  // Fallback
  const fallbackLangs = ['az', 'en', 'ru', 'tr'];
  for (const fallbackLang of fallbackLangs) {
    const fallbackField = `${fieldName}_${fallbackLang}`;
    if (item && Array.isArray(item[fallbackField]) && item[fallbackField].length > 0) {
      return item[fallbackField];
    }
  }
  
  return item?.[fieldName] || [];
}
