/**
 * WordPress Scanner
 * Extracts real WordPress information from websites
 * Phase 1: Core Scanning Engine
 */

export interface WordPressScanData {
  // Quick flag so callers can bail out if not detected
  isWordPress?: boolean;
  // Core WordPress
  core: {
    version: string;
    latest_version?: string;
    latestVersion?: string;
    is_outdated: boolean;
    isOutdated?: boolean;
    detected_from: string; // How we detected the version
  };
  
  // Plugins detected
  plugins: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version?: string;
    latestVersion?: string;
    is_active: boolean;
    is_outdated: boolean;
    isOutdated?: boolean;
    detected_from: string;
  }>;
  
  // Themes detected
  themes: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version?: string;
    latestVersion?: string;
    is_active: boolean;
    is_outdated: boolean;
    isOutdated?: boolean;
    detected_from: string;
  }>;
  
  // Server information
  server: {
    php_version?: string;
    server_software?: string;
    https_enabled: boolean;
  };
  
  // Scan metadata
  scan_metadata: {
    scanned_at: string;
    scan_duration_ms: number;
    detection_confidence: number; // 0-100
    total_checks_performed: number;
  };
}

/**
 * Main function to scan a WordPress site
 */
export async function scanWordPressSite(url: string): Promise<WordPressScanData> {
  const startTime = Date.now();
  let checksPerformed = 0;
  
  try {
    const siteUrl = normalizeUrl(url);
    
    // Run detection methods in parallel for speed
    const [coreData, pluginsData, themesData, serverData] = await Promise.allSettled([
      detectWordPressCore(siteUrl),
      detectPlugins(siteUrl),
      detectThemes(siteUrl),
      detectServerInfo(siteUrl),
    ]);
    
    // Extract results
    const core = coreData.status === 'fulfilled' ? coreData.value : {
      version: 'unknown',
      is_outdated: false,
      detected_from: 'detection failed',
    };
    checksPerformed += 1;
    
    const plugins = pluginsData.status === 'fulfilled' ? pluginsData.value : [];
    checksPerformed += 1;
    
    const themes = themesData.status === 'fulfilled' ? themesData.value : [];
    checksPerformed += 1;
    
    const server = serverData.status === 'fulfilled' ? serverData.value : {
      https_enabled: siteUrl.startsWith('https'),
    };
    checksPerformed += 1;
    
    // Calculate detection confidence
    const confidence = calculateConfidence(core, plugins, themes);
    
    const scanDuration = Date.now() - startTime;
    
    return {
      isWordPress: core.version !== 'unknown' || plugins.length > 0 || themes.length > 0,
      core: {
        ...core,
        latestVersion: core.latest_version,
        isOutdated: core.is_outdated,
      },
      plugins: plugins.map(p => ({
        ...p,
        latestVersion: p.latest_version,
        isOutdated: p.is_outdated,
      })),
      themes: themes.map(t => ({
        ...t,
        latestVersion: t.latest_version,
        isOutdated: t.is_outdated,
      })),
      server,
      scan_metadata: {
        scanned_at: new Date().toISOString(),
        scan_duration_ms: scanDuration,
        detection_confidence: confidence,
        total_checks_performed: checksPerformed,
      },
    };
    
  } catch (error) {
    console.error('WordPress scan error:', error);
    throw new Error('Failed to scan WordPress site');
  }
}

/**
 * Detect WordPress core version
 */
async function detectWordPressCore(url: string): Promise<{
  version: string;
  latest_version?: string;
  is_outdated: boolean;
  detected_from: string;
}> {
  let version = 'unknown';
  let detectedFrom = 'unknown';
  
  try {
    // Method 1: Try wp-json API
    try {
      const response = await fetch(`${url}/wp-json`, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'WP-Scan/1.0' },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check for version in different fields
        if (data.generator) {
          const match = data.generator.match(/WordPress\/(\d+\.\d+(?:\.\d+)?)/i);
          if (match) {
            version = match[1];
            detectedFrom = 'wp-json API (generator field)';
          }
        }
        
        if (version === 'unknown' && data.version) {
          version = data.version;
          detectedFrom = 'wp-json API (version field)';
        }
      }
    } catch (e) {
      // Continue to next method
    }
    
    // Method 2: Parse HTML for generator meta tag
    if (version === 'unknown') {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Check generator meta tag
          const generatorMatch = html.match(/<meta\s+name=["']generator["']\s+content=["']WordPress\s+([\d.]+)["']/i);
          if (generatorMatch) {
            version = generatorMatch[1];
            detectedFrom = 'HTML generator meta tag';
          }
          
          // Check HTML comments
          if (version === 'unknown') {
            const commentMatch = html.match(/<!--\s*WordPress\s+([\d.]+)\s*-->/i);
            if (commentMatch) {
              version = commentMatch[1];
              detectedFrom = 'HTML comment';
            }
          }
        }
      } catch (e) {
        // Continue
      }
    }
    
    // Method 3: Check readme.html
    if (version === 'unknown') {
      try {
        const response = await fetch(`${url}/readme.html`, {
          signal: AbortSignal.timeout(5000),
          headers: { 'User-Agent': 'WP-Scan/1.0' },
        });
        
        if (response.ok) {
          const text = await response.text();
          const match = text.match(/Version\s+([\d.]+)/i);
          if (match) {
            version = match[1];
            detectedFrom = 'readme.html';
          }
        }
      } catch (e) {
        // Continue
      }
    }
    
    // Get latest WordPress version
    let latestVersion: string | undefined;
    let isOutdated = false;
    
    if (version !== 'unknown') {
      try {
        latestVersion = await getLatestWordPressVersion();
        if (latestVersion) {
          isOutdated = compareVersions(version, latestVersion) < 0;
        }
      } catch (e) {
        // Can't determine if outdated
      }
    }
    
    return {
      version,
      latest_version: latestVersion,
      is_outdated: isOutdated,
      detected_from: detectedFrom,
    };
    
  } catch (error) {
    console.error('Core detection error:', error);
    return {
      version: 'unknown',
      is_outdated: false,
      detected_from: 'detection failed',
    };
  }
}

/**
 * Detect installed plugins
 */
async function detectPlugins(url: string): Promise<Array<{
  slug: string;
  name: string;
  version: string;
  latest_version?: string;
  is_active: boolean;
  is_outdated: boolean;
  detected_from: string;
}>> {
  const plugins: Map<string, any> = new Map();
  
  try {
    // Fetch homepage HTML
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      return [];
    }
    
    const html = await response.text();
    
    // Method 1: Parse wp-content/plugins URLs
    const pluginRegex = /\/wp-content\/plugins\/([^\/\?"']+)/gi;
    let match;
    
    while ((match = pluginRegex.exec(html)) !== null) {
      const slug = match[1];
      if (!plugins.has(slug) && slug !== 'index.php') {
        plugins.set(slug, {
          slug,
          name: slugToName(slug),
          version: 'unknown',
          is_active: true,
          is_outdated: false,
          detected_from: 'HTML source (wp-content path)',
        });
      }
    }
    
    // Method 2: Check for plugin-specific CSS/JS with version
    const assetRegex = /\/wp-content\/plugins\/([^\/]+)\/[^"'?]*\.(css|js)\?ver=([\d.]+)/gi;
    
    while ((match = assetRegex.exec(html)) !== null) {
      const slug = match[1];
      const version = match[3];
      
      if (plugins.has(slug)) {
        const plugin = plugins.get(slug);
        if (plugin.version === 'unknown') {
          plugin.version = version;
          plugin.detected_from = 'Asset version parameter';
        }
      } else {
        plugins.set(slug, {
          slug,
          name: slugToName(slug),
          version,
          is_active: true,
          is_outdated: false,
          detected_from: 'Asset version parameter',
        });
      }
    }
    
    // Method 3: Try to get versions from readme.txt for known plugins
    const pluginsArray = Array.from(plugins.values());
    
    // Limit to first 10 plugins for performance
    const pluginsToCheck = pluginsArray.slice(0, 10);
    
    await Promise.allSettled(
      pluginsToCheck.map(async (plugin) => {
        if (plugin.version === 'unknown') {
          const version = await getPluginVersion(url, plugin.slug);
          if (version) {
            plugin.version = version;
            plugin.detected_from = 'Plugin readme.txt';
          }
        }
      })
    );
    
    // Get latest versions from WordPress.org
    await Promise.allSettled(
      pluginsArray.slice(0, 15).map(async (plugin) => {
        try {
          const latestVersion = await getLatestPluginVersion(plugin.slug);
          if (latestVersion) {
            plugin.latest_version = latestVersion;
            if (plugin.version !== 'unknown') {
              plugin.is_outdated = compareVersions(plugin.version, latestVersion) < 0;
            }
          }
        } catch (e) {
          // Ignore errors
        }
      })
    );
    
    return pluginsArray;
    
  } catch (error) {
    console.error('Plugin detection error:', error);
    return [];
  }
}

/**
 * Detect installed themes
 */
async function detectThemes(url: string): Promise<Array<{
  slug: string;
  name: string;
  version: string;
  latest_version?: string;
  is_active: boolean;
  is_outdated: boolean;
  detected_from: string;
}>> {
  const themes: Map<string, any> = new Map();
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      return [];
    }
    
    const html = await response.text();
    
    // Method 1: Parse wp-content/themes URLs
    const themeRegex = /\/wp-content\/themes\/([^\/\?"']+)/gi;
    let match;
    
    while ((match = themeRegex.exec(html)) !== null) {
      const slug = match[1];
      if (!themes.has(slug) && slug !== 'index.php') {
        themes.set(slug, {
          slug,
          name: slugToName(slug),
          version: 'unknown',
          is_active: true,
          is_outdated: false,
          detected_from: 'HTML source (wp-content path)',
        });
      }
    }
    
    // Method 2: Check stylesheet link with version
    const stylesheetRegex = /\/wp-content\/themes\/([^\/]+)\/style\.css\?ver=([\d.]+)/gi;
    
    while ((match = stylesheetRegex.exec(html)) !== null) {
      const slug = match[1];
      const version = match[2];
      
      if (themes.has(slug)) {
        const theme = themes.get(slug);
        theme.version = version;
        theme.detected_from = 'Stylesheet version parameter';
      } else {
        themes.set(slug, {
          slug,
          name: slugToName(slug),
          version,
          is_active: true,
          is_outdated: false,
          detected_from: 'Stylesheet version parameter',
        });
      }
    }
    
    // Get latest versions from WordPress.org
    const themesArray = Array.from(themes.values());
    
    await Promise.allSettled(
      themesArray.slice(0, 5).map(async (theme) => {
        try {
          const latestVersion = await getLatestThemeVersion(theme.slug);
          if (latestVersion) {
            theme.latest_version = latestVersion;
            if (theme.version !== 'unknown') {
              theme.is_outdated = compareVersions(theme.version, latestVersion) < 0;
            }
          }
        } catch (e) {
          // Ignore errors
        }
      })
    );
    
    return themesArray;
    
  } catch (error) {
    console.error('Theme detection error:', error);
    return [];
  }
}

/**
 * Detect server information
 */
async function detectServerInfo(url: string): Promise<{
  php_version?: string;
  server_software?: string;
  https_enabled: boolean;
}> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'WP-Scan/1.0' },
    });
    
    const serverHeader = response.headers.get('server');
    const xPoweredBy = response.headers.get('x-powered-by');
    
    let phpVersion: string | undefined;
    if (xPoweredBy) {
      const match = xPoweredBy.match(/PHP\/([\d.]+)/i);
      if (match) {
        phpVersion = match[1];
      }
    }
    
    return {
      php_version: phpVersion,
      server_software: serverHeader || undefined,
      https_enabled: url.startsWith('https'),
    };
    
  } catch (error) {
    return {
      https_enabled: url.startsWith('https'),
    };
  }
}

/**
 * Get latest WordPress version from WordPress.org
 */
async function getLatestWordPressVersion(): Promise<string | undefined> {
  try {
    const response = await fetch('https://api.wordpress.org/core/version-check/1.7/', {
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.offers && data.offers.length > 0) {
        return data.offers[0].version;
      }
    }
  } catch (e) {
    console.error('Failed to get latest WordPress version:', e);
  }
  
  return undefined;
}

/**
 * Get plugin version from readme.txt
 */
async function getPluginVersion(siteUrl: string, slug: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${siteUrl}/wp-content/plugins/${slug}/readme.txt`, {
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'WP-Scan/1.0' },
    });
    
    if (response.ok) {
      const text = await response.text();
      const match = text.match(/Stable tag:\s*([\d.]+)/i);
      if (match) {
        return match[1];
      }
    }
  } catch (e) {
    // Ignore
  }
  
  return undefined;
}

/**
 * Get latest plugin version from WordPress.org
 */
async function getLatestPluginVersion(slug: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&request[slug]=${slug}`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.version;
    }
  } catch (e) {
    // Ignore
  }
  
  return undefined;
}

/**
 * Get latest theme version from WordPress.org
 */
async function getLatestThemeVersion(slug: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://api.wordpress.org/themes/info/1.2/?action=theme_information&request[slug]=${slug}`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.version;
    }
  } catch (e) {
    // Ignore
  }
  
  return undefined;
}

/**
 * Compare two version strings
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  
  return 0;
}

/**
 * Convert slug to readable name
 */
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calculate detection confidence based on results
 */
function calculateConfidence(
  core: any,
  plugins: any[],
  themes: any[]
): number {
  let confidence = 0;
  
  // Core version detected
  if (core.version !== 'unknown') {
    confidence += 40;
  }
  
  // Plugins detected
  if (plugins.length > 0) {
    confidence += Math.min(30, plugins.length * 5);
  }
  
  // Themes detected
  if (themes.length > 0) {
    confidence += Math.min(20, themes.length * 10);
  }
  
  // Version information available
  const pluginsWithVersion = plugins.filter(p => p.version !== 'unknown').length;
  if (pluginsWithVersion > 0) {
    confidence += Math.min(10, pluginsWithVersion * 2);
  }
  
  return Math.min(100, confidence);
}

/**
 * Normalize URL format
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = `https://${normalized}`;
  }
  
  normalized = normalized.replace(/\/$/, '');
  
  return normalized;
}
