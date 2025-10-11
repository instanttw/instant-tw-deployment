// Cookie utility functions for persistent storage

export interface CookieConsentData {
  preferences: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  timestamp: string;
  sessionId: string;
  version: string;
}

const COOKIE_NAME = 'instant_cookie_consent';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Generate a unique session identifier
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set a cookie with consent data
 */
export function setConsentCookie(data: CookieConsentData): void {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
  
  const cookieValue = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
}

/**
 * Get consent data from cookie
 */
export function getConsentCookie(): CookieConsentData | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const consentCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${COOKIE_NAME}=`)
  );
  
  if (!consentCookie) return null;
  
  try {
    const value = consentCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

/**
 * Delete consent cookie
 */
export function deleteConsentCookie(): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if consent is valid (not expired, has valid structure)
 */
export function isConsentValid(data: CookieConsentData | null): boolean {
  if (!data) return false;
  
  // Check if consent is older than 365 days
  const consentDate = new Date(data.timestamp);
  const daysSinceConsent = (Date.now() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceConsent > COOKIE_EXPIRY_DAYS) {
    return false;
  }
  
  // Validate structure
  return (
    data.preferences &&
    typeof data.preferences.necessary === 'boolean' &&
    typeof data.preferences.functional === 'boolean' &&
    typeof data.preferences.analytics === 'boolean' &&
    typeof data.preferences.marketing === 'boolean' &&
    !!data.timestamp &&
    !!data.sessionId
  );
}
