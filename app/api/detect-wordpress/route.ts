import { NextRequest, NextResponse } from 'next/server';

export interface WordPressDetectionResult {
  isWordPress: boolean;
  confidence: number; // 0-100
  detectedIndicators: string[];
  failedChecks: string[];
  method?: string; // Which detection method succeeded
}

/**
 * Server-side WordPress detection API
 * Avoids CORS issues by running checks from the server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await detectWordPressSite(url);
    return NextResponse.json(result);

  } catch (error) {
    console.error('WordPress detection API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to detect WordPress',
        isWordPress: false,
        confidence: 0,
        detectedIndicators: [],
        failedChecks: ['Server error']
      },
      { status: 500 }
    );
  }
}

/**
 * Detect if a URL is a WordPress site
 * Server-side implementation to avoid CORS
 */
async function detectWordPressSite(url: string): Promise<WordPressDetectionResult> {
  const indicators: string[] = [];
  const failed: string[] = [];
  let detectionMethod = '';

  try {
    // Normalize URL
    const siteUrl = normalizeUrl(url);
    
    // Priority 1: Check wp-json REST API (most reliable)
    const wpJsonResult = await checkWpJson(siteUrl);
    if (wpJsonResult.found) {
      indicators.push('wp-json REST API');
      detectionMethod = 'REST API';
    } else {
      failed.push('wp-json REST API');
    }

    // Priority 2: Parse main page HTML for WordPress indicators
    const htmlResult = await checkHtmlIndicators(siteUrl);
    if (htmlResult.found) {
      indicators.push(...htmlResult.indicators);
      if (!detectionMethod) detectionMethod = 'HTML Analysis';
    }
    if (htmlResult.failed.length > 0) {
      failed.push(...htmlResult.failed);
    }

    // Priority 3: Check common WordPress endpoints (fallback)
    const endpointChecks = await Promise.allSettled([
      checkWpLogin(siteUrl),
      checkFeed(siteUrl),
      checkXmlRpc(siteUrl),
    ]);

    const endpointNames = ['wp-login.php', 'RSS feed', 'xmlrpc.php'];
    endpointChecks.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        indicators.push(endpointNames[index]);
        if (!detectionMethod) detectionMethod = 'Endpoint Check';
      } else {
        failed.push(endpointNames[index]);
      }
    });

    // Calculate confidence
    // Strong indicators (wp-json or generator meta) alone give high confidence
    const hasStrongIndicator = indicators.some(i => 
      i.includes('wp-json') || i.includes('generator meta') || i.includes('wp-content')
    );

    let confidence = 0;
    if (hasStrongIndicator) {
      confidence = Math.min(100, 50 + (indicators.length * 15));
    } else {
      confidence = Math.min(100, indicators.length * 20);
    }

    // Lower threshold: 1 strong indicator OR 2+ weak indicators
    const isWordPress = hasStrongIndicator || indicators.length >= 2;

    return {
      isWordPress,
      confidence: Math.round(confidence),
      detectedIndicators: indicators,
      failedChecks: failed,
      method: detectionMethod || 'None',
    };

  } catch (error) {
    console.error('WordPress detection error:', error);
    return {
      isWordPress: false,
      confidence: 0,
      detectedIndicators: [],
      failedChecks: ['Connection failed or timeout'],
      method: 'Error',
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
 * Check WordPress REST API (most reliable method)
 */
async function checkWpJson(url: string): Promise<{ found: boolean }> {
  try {
    // Try both /wp-json/ and /wp-json/wp/v2
    const endpoints = [
      `${url}/wp-json/`,
      `${url}/wp-json/wp/v2`,
      `${url}/?rest_route=/`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          signal: AbortSignal.timeout(8000),
          headers: {
            'User-Agent': 'WP-Scan/1.0 (WordPress Site Checker)',
          },
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const data = await response.json();
            
            // Check for WordPress API indicators
            if (data.namespaces || data.routes || data.name || 
                data.description?.includes('WordPress') ||
                data.url || data.home) {
              return { found: true };
            }
          }
        }
      } catch {
        // Try next endpoint
        continue;
      }
    }

    return { found: false };
  } catch {
    return { found: false };
  }
}

/**
 * Check HTML for WordPress indicators
 */
async function checkHtmlIndicators(url: string): Promise<{ 
  found: boolean; 
  indicators: string[]; 
  failed: string[];
}> {
  const indicators: string[] = [];
  const failed: string[] = [];

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      failed.push('HTML fetch failed');
      return { found: false, indicators, failed };
    }

    const html = await response.text();

    // Check 1: WordPress generator meta tag
    const generatorMatch = html.match(/<meta\s+name=["']generator["']\s+content=["']WordPress\s*([\d.]+)?["']/i);
    if (generatorMatch) {
      indicators.push(`generator meta (WP ${generatorMatch[1] || 'unknown'})`);
    } else {
      failed.push('generator meta');
    }

    // Check 2: wp-content URLs in HTML
    const wpContentMatches = html.match(/\/wp-content\/(themes|plugins|uploads)/gi);
    if (wpContentMatches && wpContentMatches.length >= 2) {
      indicators.push(`wp-content paths (${wpContentMatches.length} found)`);
    } else {
      failed.push('wp-content paths');
    }

    // Check 3: wp-includes in scripts/styles
    const wpIncludesMatches = html.match(/\/wp-includes\/(js|css)/gi);
    if (wpIncludesMatches) {
      indicators.push('wp-includes assets');
    } else {
      failed.push('wp-includes');
    }

    // Check 4: WordPress body classes
    const wpBodyClass = /<body[^>]*class=["'][^"']*\b(home|page-template|single|archive|wp-|wordpress)\b/i.test(html);
    if (wpBodyClass) {
      indicators.push('WordPress body classes');
    } else {
      failed.push('WP body classes');
    }

    // Check 5: RSD (Really Simple Discovery) link
    const hasRsd = /<link[^>]*rel=["']EditURI["'][^>]*xmlrpc\.php/i.test(html);
    if (hasRsd) {
      indicators.push('RSD link');
    }

    // Check 6: WordPress emoji script
    const hasEmoji = /wp-emoji-release\.min\.js/i.test(html);
    if (hasEmoji) {
      indicators.push('WP emoji script');
    }

    // Check 7: wlwmanifest link
    const hasWlw = /<link[^>]*rel=["']wlwmanifest["']/i.test(html);
    if (hasWlw) {
      indicators.push('WLW manifest');
    }

    return { 
      found: indicators.length > 0, 
      indicators, 
      failed 
    };

  } catch (error) {
    failed.push('HTML parse error');
    return { found: false, indicators, failed };
  }
}

/**
 * Check for wp-login.php
 */
async function checkWpLogin(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/wp-login.php`, {
      method: 'GET',
      signal: AbortSignal.timeout(8000),
      redirect: 'manual', // Don't follow redirects
      headers: {
        'User-Agent': 'WP-Scan/1.0',
      },
    });

    // 200, 301, 302 all indicate wp-login exists
    return response.status === 200 || response.status === 301 || response.status === 302;
  } catch {
    return false;
  }
}

/**
 * Check for WordPress feed
 */
async function checkFeed(url: string): Promise<boolean> {
  try {
    const endpoints = [`${url}/feed/`, `${url}/?feed=rss2`];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          signal: AbortSignal.timeout(8000),
          headers: {
            'User-Agent': 'WP-Scan/1.0',
          },
        });

        if (response.ok) {
          const text = await response.text();
          // Check for WordPress generator in feed
          if (text.includes('<generator>https://wordpress.org/') || 
              text.includes('WordPress') ||
              text.includes('<?xml')) {
            return true;
          }
        }
      } catch {
        continue;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Check for xmlrpc.php
 */
async function checkXmlRpc(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/xmlrpc.php`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'WP-Scan/1.0',
        'Content-Type': 'text/xml',
      },
      body: '<?xml version="1.0"?><methodCall><methodName>demo.sayHello</methodName></methodCall>',
    });

    // WordPress xmlrpc returns specific responses
    if (response.ok || response.status === 405) {
      const text = await response.text();
      return text.includes('XML-RPC') || text.includes('WordPress');
    }

    return false;
  } catch {
    return false;
  }
}
