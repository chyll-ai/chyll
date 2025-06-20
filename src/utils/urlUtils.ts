
/**
 * Normalizes URLs by removing prefixes and ensuring proper protocols
 */
export function normalizeUrl(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  let cleanUrl = url.trim();
  
  // Remove any chyll.ai/ or similar prefixes
  cleanUrl = cleanUrl.replace(/^.*chyll\.ai\/+/, '');
  cleanUrl = cleanUrl.replace(/^.*chyll\.ai$/, '');
  
  // Remove any other domain prefixes that might be incorrect
  cleanUrl = cleanUrl.replace(/^[^/]*\.com\/+(?!.*linkedin\.com|.*github\.com|.*twitter\.com|.*facebook\.com)/, '');
  
  // Handle LinkedIn URLs specifically
  if (cleanUrl.includes('linkedin.com')) {
    // Remove leading slashes or incomplete protocols
    cleanUrl = cleanUrl.replace(/^\/+/, '');
    cleanUrl = cleanUrl.replace(/^https?:\/\/\/+/, '');
    
    // Add protocol if missing
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    // Ensure LinkedIn URLs are properly formatted with www
    cleanUrl = cleanUrl.replace(/^https?:\/\/(?!www\.)/, 'https://www.');
    
    // Ensure it contains linkedin.com
    if (!cleanUrl.includes('linkedin.com')) {
      return null;
    }
  }
  
  // Handle GitHub URLs
  else if (cleanUrl.includes('github.com')) {
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/^https?:\/\/(?:www\.)?/, 'https://');
  }
  
  // Handle Twitter URLs
  else if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) {
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/^https?:\/\/(?:www\.)?/, 'https://');
  }
  
  // Handle Facebook URLs
  else if (cleanUrl.includes('facebook.com')) {
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    cleanUrl = cleanUrl.replace(/^https?:\/\/(?:www\.)?/, 'https://www.');
  }
  
  // Handle general website URLs
  else {
    // Remove leading slashes or incomplete protocols
    cleanUrl = cleanUrl.replace(/^\/+/, '');
    cleanUrl = cleanUrl.replace(/^https?:\/\/\/+/, '');
    
    // Add protocol if missing
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
  }
  
  // Basic URL validation
  try {
    const urlObj = new URL(cleanUrl);
    // Ensure it's a valid domain
    if (urlObj.hostname && urlObj.hostname.includes('.')) {
      return cleanUrl;
    }
  } catch (error) {
    console.warn('Invalid URL after normalization:', cleanUrl);
    return null;
  }
  
  return null;
}

/**
 * Validates if a URL is accessible and properly formatted
 */
export function isValidUrl(url: string | undefined): boolean {
  const normalized = normalizeUrl(url);
  return normalized !== null;
}
