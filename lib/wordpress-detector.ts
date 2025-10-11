/**
 * WordPress Site Detection Utility
 * Validates if a URL is a WordPress website before scanning
 */

export interface WordPressDetectionResult {
  isWordPress: boolean;
  confidence: number; // 0-100
  detectedIndicators: string[];
  failedChecks: string[];
}

/**
 * Check if a URL is a WordPress website
 * Uses multiple detection methods for accuracy
 */
export async function detectWordPressSite(url: string): Promise<WordPressDetectionResult> {
  const indicators: string[] = [];
  const failed: string[] = [];
  
  try {
    // Normalize URL
    const siteUrl = normalizeUrl(url);
    
    // Run all detection checks in parallel for speed
    const checks = await Promise.allSettled([
      checkWpAdmin(siteUrl),
      checkWpLogin(siteUrl),
      checkWpContent(siteUrl),
      checkWpIncludes(siteUrl),
      checkWpJson(siteUrl),
      checkXmlRpc(siteUrl),
      checkHtmlMeta(siteUrl),
    ]);
    
    // Process results
    checks.forEach((result, index) => {
      const checkNames = [
        'wp-admin',
        'wp-login.php',
        'wp-content',
        'wp-includes',
        'wp-json API',
        'xmlrpc.php',
        'HTML meta tags',
      ];
      
      if (result.status === 'fulfilled' && result.value) {
        indicators.push(checkNames[index]);
      } else {
        failed.push(checkNames[index]);
      }
    });
    
    // Calculate confidence (need at least 2 indicators)
    const confidence = Math.min(100, (indicators.length / 7) * 100);
    const isWordPress = indicators.length >= 2;
    
    return {
      isWordPress,
      confidence: Math.round(confidence),
      detectedIndicators: indicators,
      failedChecks: failed,
    };
    
  } catch (error) {
    console.error('WordPress detection error:', error);
    return {
      isWordPress: false,
      confidence: 0,
      detectedIndicators: [],
      failedChecks: ['Connection failed'],
    };
  }
}

/**
 * Normalize URL format
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  // Add protocol if missing
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = `https://${normalized}`;
  }
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized;
}

/**
 * Check for /wp-admin/ directory
 */
async function checkWpAdmin(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/wp-admin/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    // 200, 301, 302, or 403 means directory exists
    return response.status === 200 || response.status === 301 || 
           response.status === 302 || response.status === 403;
  } catch {
    return false;
  }
}

/**
 * Check for /wp-login.php
 */
async function checkWpLogin(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/wp-login.php`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * Check for /wp-content/ directory
 */
async function checkWpContent(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/wp-content/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    return response.status === 200 || response.status === 403;
  } catch {
    return false;
  }
}

/**
 * Check for /wp-includes/ directory
 */
async function checkWpIncludes(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/wp-includes/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    return response.status === 200 || response.status === 403;
  } catch {
    return false;
  }
}

/**
 * Check for WordPress REST API
 */
async function checkWpJson(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/wp-json/`, {
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      // Check if response has WordPress API indicators
      return !!(data.namespaces || data.routes || data.description?.includes('WordPress'));
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Check for xmlrpc.php endpoint
 */
async function checkXmlRpc(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/xmlrpc.php`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    return response.status === 200 || response.status === 405;
  } catch {
    return false;
  }
}

/**
 * Check HTML meta tags for WordPress generator
 */
async function checkHtmlMeta(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const html = await response.text();
      
      // Check for WordPress generator meta tag
      const hasGenerator = /<meta\s+name=["']generator["']\s+content=["']WordPress/i.test(html);
      
      // Check for wp-content or wp-includes in HTML
      const hasWpPaths = /\/wp-content\/|\/wp-includes\//i.test(html);
      
      // Check for WordPress classes or IDs
      const hasWpClasses = /class=["'][^"']*wp-/i.test(html);
      
      return hasGenerator || (hasWpPaths && hasWpClasses);
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Get a friendly message for detection result
 */
export function getDetectionMessage(result: WordPressDetectionResult): string {
  if (result.isWordPress) {
    return `WordPress detected with ${result.confidence}% confidence (${result.detectedIndicators.length} indicators found)`;
  } else if (result.confidence > 30) {
    return `WordPress detection uncertain (${result.confidence}% confidence). Results may be inaccurate.`;
  } else {
    return 'This does not appear to be a WordPress website. WP Scan only works with WordPress sites.';
  }
}
