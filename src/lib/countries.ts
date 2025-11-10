/**
 * Utility functions for working with REST Countries API
 * Provides country data with Arabic and English translations
 */

export interface Country {
  cca2: string; // ISO 3166-1 alpha-2 code (e.g., "US")
  cca3: string; // ISO 3166-1 alpha-3 code (e.g., "USA")
  name: {
    common: string;
    official: string;
  };
  translations: {
    ara: {
      common: string;
      official: string;
    };
  };
  capital?: string[]; // Capital cities
}

export interface CountryOption {
  value: string; // ISO2 code
  label: string; // Localized name
  nameEn: string; // English name
  nameAr: string; // Arabic name
}

let countriesCache: Country[] | null = null;
let countriesCachePromise: Promise<Country[]> | null = null;

/**
 * Fetch all countries from REST Countries API with caching
 */
export async function fetchCountries(): Promise<Country[]> {
  // Return cached data if available
  if (countriesCache) {
    return countriesCache;
  }

  // Return existing promise if fetch is in progress
  if (countriesCachePromise) {
    return countriesCachePromise;
  }

  // Fetch countries
  countriesCachePromise = fetch('https://restcountries.com/v3.1/all?fields=cca2,cca3,name,translations,capital')
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data: Country[] = await response.json();
      countriesCache = data;
      return data;
    })
    .catch((error) => {
      console.error('Error fetching countries:', error);
      countriesCachePromise = null;
      throw error;
    });

  return countriesCachePromise;
}

/**
 * Get country options for a select dropdown
 * @param locale - Current locale ('en' or 'ar')
 */
export async function getCountryOptions(locale: 'en' | 'ar'): Promise<CountryOption[]> {
  const countries = await fetchCountries();
  
  return countries
    .map((country) => {
      const nameEn = country.name.common;
      const nameAr = country.translations?.ara?.common || nameEn;
      
      return {
        value: country.cca2,
        label: locale === 'ar' ? nameAr : nameEn,
        nameEn,
        nameAr,
      };
    })
    .sort((a, b) => {
      // Sort by the label in the current locale
      return a.label.localeCompare(b.label, locale === 'ar' ? 'ar' : 'en');
    });
}

/**
 * Get country name by ISO2 code
 * @param iso2 - ISO 3166-1 alpha-2 code
 * @param locale - Current locale ('en' or 'ar')
 */
export async function getCountryName(iso2: string, locale: 'en' | 'ar'): Promise<string | null> {
  if (!iso2) return null;
  
  const countries = await fetchCountries();
  const country = countries.find((c) => c.cca2.toLowerCase() === iso2.toLowerCase());
  
  if (!country) return null;
  
  if (locale === 'ar') {
    return country.translations?.ara?.common || country.name.common;
  }
  
  return country.name.common;
}

/**
 * Get country by ISO2 code
 */
export async function getCountryByCode(iso2: string): Promise<Country | null> {
  if (!iso2) return null;
  
  const countries = await fetchCountries();
  return countries.find((c) => c.cca2.toLowerCase() === iso2.toLowerCase()) || null;
}

/**
 * Find country by name (English or Arabic)
 */
export async function findCountryByName(name: string): Promise<Country | null> {
  if (!name) return null;
  
  const countries = await fetchCountries();
  const searchName = name.toLowerCase().trim();
  
  return (
    countries.find((c) => {
      const nameEn = c.name.common.toLowerCase();
      const nameAr = c.translations?.ara?.common?.toLowerCase() || '';
      const nameEnOfficial = c.name.official.toLowerCase();
      const nameArOfficial = c.translations?.ara?.official?.toLowerCase() || '';
      
      return (
        nameEn === searchName ||
        nameAr === searchName ||
        nameEnOfficial === searchName ||
        nameArOfficial === searchName ||
        nameEn.includes(searchName) ||
        nameAr.includes(searchName)
      );
    }) || null
  );
}

/**
 * City translations mapping for Saudi Arabia and other countries
 * This provides Arabic translations for cities that are not available in REST Countries API
 */
const cityTranslationsMap: Record<string, string> = {
  // Saudi Arabia cities
  "Abha": "أبها",
  "Abqaiq": "بقيق",
  "Al Bahah": "الباحة",
  "Al Faruq": "الفاروق",
  "Al Hufuf": "الهفوف",
  "Al Qatif": "القطيف",
  "Al Yamamah": "اليمامة",
  "At Tuwal": "الطوال",
  "Buraidah": "بريدة",
  "Dammam": "الدمام",
  "Dhahran": "الظهران",
  "Hayil": "حائل",
  "Jazirah": "الجزيرة",
  "Jeddah": "جدة",
  "Jizan": "جازان",
  "Jubail": "الجبيل",
  "Khamis Mushait": "خميس مشيط",
  "Khobar": "الخبر",
  "Khulays": "خليص",
  "Linah": "لينة",
  "Madinat Yanbu` as Sina`iyah": "مدينة ينبع الصناعية",
  "Mecca": "مكة المكرمة",
  "Medina": "المدينة المنورة",
  "Mina": "منى",
  "Najran": "نجران",
  "Rabigh": "رابغ",
  "Rahimah": "رحيمة",
  "Rahman": "الرحمن",
  "Ramdah": "رمدة",
  "Ras Tanura": "رأس تنورة",
  "Riyadh": "الرياض",
  "Sabya": "صبيا",
  "Safwa": "صفوى",
  "Sakaka": "سكاكا",
  "Sambah": "صمبة",
  "Sayhat": "سيهات",
  "Tabuk": "تبوك",
  "Yanbu` al Bahr": "ينبع البحر",
  // Common variations
  "Yanbu": "ينبع",
  "Al Jubail": "الجبيل",
  "Al Khobar": "الخبر",
  "Taif": "الطائف",
  "Al Taif": "الطائف",
  "Hail": "حائل",
  "Arar": "عرعر",
  "Qatif": "القطيف",
};

/**
 * Get city translations from REST Countries API (for capital cities) or from our mapping
 * Note: REST Countries API only provides capital cities, not all cities
 * For other cities, we use our translation mapping
 */
export async function getCityTranslation(cityName: string, locale: 'en' | 'ar'): Promise<string> {
  if (!cityName || locale !== 'ar') return cityName;
  
  // First check our translation mapping
  const normalizedCityName = cityName.trim();
  if (cityTranslationsMap[normalizedCityName]) {
    return cityTranslationsMap[normalizedCityName];
  }
  
  // Also check case-insensitive
  const cityKey = Object.keys(cityTranslationsMap).find(
    key => key.toLowerCase() === normalizedCityName.toLowerCase()
  );
  if (cityKey) {
    return cityTranslationsMap[cityKey];
  }
  
  try {
    // Try to find the city as a capital in REST Countries
    const countries = await fetchCountries();
    const country = countries.find((c) => {
      if (!c.capital || c.capital.length === 0) return false;
      return c.capital.some(capital => 
        capital.toLowerCase() === normalizedCityName.toLowerCase()
      );
    });
    
    if (country) {
      // Return Arabic country name (capital cities often share the country's Arabic name)
      return country.translations?.ara?.common || cityName;
    }
    
    // For cities not found, return as-is
    return cityName;
  } catch (error) {
    console.error('Error fetching city translation:', error);
    return cityName;
  }
}

