import { SEARCH_ENGINE_PREFIX } from '../constants';

export const formatUrl = (input: string): string => {
  if (!input) return '';
  
  // If it's a valid URL with protocol, return it
  try {
    const url = new URL(input);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return input;
    }
  } catch (e) {
    // Not a valid URL object yet
  }

  // If input contains spaces, it's definitely a search query
  if (input.includes(' ')) {
    return `${SEARCH_ENGINE_PREFIX}${encodeURIComponent(input)}`;
  }

  // Heuristic: If it's a single word without dots (e.g. "netflix"), auto-fill www and .com
  const isSingleWord = /^[a-zA-Z0-9-]+$/.test(input);
  if (isSingleWord) {
    return `https://www.${input}.com`;
  }

  // Detect simple domain patterns (e.g., google.com, localhost:3000)
  // If it has a dot, assume it's a domain and prepend https://
  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost(:\d+)?/;
  if (domainRegex.test(input) || input.includes('.')) {
    return `https://${input}`;
  }

  // Fallback: Treat as search query
  return `${SEARCH_ENGINE_PREFIX}${encodeURIComponent(input)}`;
};

export const getDisplayTitle = (url: string): string => {
  if (url === 'about:blank') return 'New Tab';
  
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'www.wikipedia.org' || parsed.hostname === 'wikipedia.org') return 'Wikipedia';
    if (!parsed.hostname) return 'New Tab';
    
    // Remove www. and .com for cleaner display
    let name = parsed.hostname.replace(/^www\./, '');
    
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return url || 'New Tab';
  }
};
