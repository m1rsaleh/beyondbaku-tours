import { useState } from 'react';
import { translationService } from '../../services/translationService';

interface Props {
  label: string;
  name: string;
  value: {
    tr: string;
    en: string;
    ru: string;
    az: string;
  };
  onChange: (name: string, value: any) => void;
  type?: 'input' | 'textarea';
  required?: boolean;
  rows?: number;
}

export default function MultilingualInput({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'input',
  required = false,
  rows = 4
}: Props) {
  const [translating, setTranslating] = useState<string | null>(null);

  const handleTranslate = async (targetLang: 'en' | 'ru' | 'az') => {
    if (!value.tr || value.tr.trim() === '') {
      alert('Önce Türkçe/Azerbaycan dilinde metni girin!');
      return;
    }

    setTranslating(targetLang);
    try {
      const translated = await translationService.translate(value.tr, targetLang);
      onChange(name, { ...value, [targetLang]: translated });
    } catch (error) {
      alert('Çeviri başarısız. Lütfen manuel girin.');
    } finally {
      setTranslating(null);
    }
  };

  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', disabled: false },
    { code: 'az', label: 'Azərbaycan', flag: '🇦🇿', canTranslate: true },
    { code: 'en', label: 'English', flag: '🇬🇧', canTranslate: true },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', canTranslate: true }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {languages.map((lang) => (
        <div key={lang.code} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <span className="text-xl">{lang.flag}</span>
              {lang.label}
            </label>
            
            {lang.canTranslate && (
              <button
                type="button"
                onClick={() => handleTranslate(lang.code as 'en' | 'ru' | 'az')}
                disabled={translating !== null || !value.tr}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {translating === lang.code ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Çevriliyor...
                  </>
                ) : (
                  <>
                    🤖 AI Çevir
                  </>
                )}
              </button>
            )}
          </div>

          {type === 'textarea' ? (
            <textarea
              value={value[lang.code as keyof typeof value] || ''}
              onChange={(e) => onChange(name, { ...value, [lang.code]: e.target.value })}
              rows={rows}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`${lang.label} dilinde ${label.toLowerCase()}`}
              required={required && lang.code === 'tr'}
            />
          ) : (
            <input
              type="text"
              value={value[lang.code as keyof typeof value] || ''}
              onChange={(e) => onChange(name, { ...value, [lang.code]: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`${lang.label} dilinde ${label.toLowerCase()}`}
              required={required && lang.code === 'tr'}
            />
          )}
        </div>
      ))}
    </div>
  );
}
