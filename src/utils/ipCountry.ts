
/**
 * Utility functions for IP-based country detection
 */

// Free IP geolocation API
const IP_API_URL = 'https://ip-api.com/json/?fields=status,message,countryCode';

/**
 * Detects user country from IP address
 * @returns Promise with ISO country code (e.g. 'US', 'FR')
 */
export const detectCountryFromIP = async (): Promise<string> => {
  try {
    const response = await fetch(IP_API_URL);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.countryCode;
    }
    
    console.warn('Could not detect country from IP:', data.message);
    return '';
  } catch (error) {
    console.error('Error detecting country from IP:', error);
    return '';
  }
};

/**
 * Maps country codes to supported languages
 * @param countryCode ISO country code
 * @returns Language code or empty string if no mapping found
 */
export const mapCountryToLanguage = (countryCode: string): string => {
  // Map of countries where French is the primary language
  const frenchSpeakingCountries = [
    'FR', // France
    'BE', // Belgium
    'CA', // Canada (partially)
    'CH', // Switzerland
    'LU', // Luxembourg
    'MC', // Monaco
    'DZ', // Algeria
    'MA', // Morocco
    'TN', // Tunisia
    'CI', // Ivory Coast
    'SN', // Senegal
    'ML', // Mali
    'NE', // Niger
    'BF', // Burkina Faso
    'GN', // Guinea
    'BJ', // Benin
    'GA', // Gabon
    'TD', // Chad
    'HT', // Haiti
  ];
  
  if (frenchSpeakingCountries.includes(countryCode)) {
    return 'fr';
  }
  
  // Default to English for other countries
  return 'en';
};

