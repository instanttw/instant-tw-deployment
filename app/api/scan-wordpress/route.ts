import { NextRequest, NextResponse } from 'next/server';
import { scanWordPressSite, type WordPressScanData } from '@/lib/wordpress-scanner';
import { 
  checkVulnerabilities, 
  calculateRiskScore,
  type VulnerabilityCheckResult 
} from '@/lib/vulnerability-checker';

export interface ScanResult {
  url: string;
  scanned_at: string;
  scan_duration_ms: number;
  
  // WordPress Core
  core: {
    version: string;
    latest_version?: string;
    status: 'secure' | 'outdated' | 'vulnerable';
    vulnerabilities: number;
    detected_from: string;
  };
  
  // Plugins
  plugins: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version?: string;
    status: 'secure' | 'outdated' | 'vulnerable';
    vulnerabilities: number;
    detected_from: string;
  }>;
  
  // Themes
  themes: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version?: string;
    status: 'secure' | 'outdated' | 'vulnerable';
    vulnerabilities: number;
    detected_from: string;
  }>;
  
  // Security info
  security: string[];
  
  // Risk assessment
  risk_score: number;
  total_vulnerabilities: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  
  // Scan metadata
  detection_confidence: number;
  https_enabled: boolean;
}

/**
 * POST /api/scan-wordpress
 * Real WordPress vulnerability scanner
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`[WP Scan] Starting scan for: ${url}`);

    // Step 1: Scan WordPress site for components
    const wpData: WordPressScanData = await scanWordPressSite(url);
    
    console.log(`[WP Scan] WordPress data collected:`, {
      core: wpData.core.version,
      plugins: wpData.plugins.length,
      themes: wpData.themes.length,
      confidence: wpData.scan_metadata.detection_confidence,
    });

    // Step 2: Check for vulnerabilities
    const vulnerabilities: VulnerabilityCheckResult = await checkVulnerabilities(
      wpData.core.version,
      wpData.plugins.map(p => ({ slug: p.slug, version: p.version })),
      wpData.themes.map(t => ({ slug: t.slug, version: t.version }))
    );
    
    console.log(`[WP Scan] Vulnerabilities found:`, {
      total: vulnerabilities.total_vulnerabilities,
      critical: vulnerabilities.severity_breakdown.critical,
      high: vulnerabilities.severity_breakdown.high,
    });

    // Step 3: Calculate risk score
    const riskScore = calculateRiskScore(vulnerabilities);

    // Step 4: Build security checks
    const securityChecks = buildSecurityChecks(wpData, vulnerabilities);

    // Step 5: Format scan results
    const scanResult: ScanResult = {
      url,
      scanned_at: new Date().toISOString(),
      scan_duration_ms: Date.now() - startTime,
      
      core: {
        version: wpData.core.version,
        latest_version: wpData.core.latest_version,
        status: getCoreStatus(wpData.core, vulnerabilities.core_vulnerabilities),
        vulnerabilities: vulnerabilities.core_vulnerabilities.length,
        detected_from: wpData.core.detected_from,
      },
      
      plugins: wpData.plugins.map(plugin => ({
        slug: plugin.slug,
        name: plugin.name,
        version: plugin.version,
        latest_version: plugin.latest_version,
        status: getComponentStatus(
          plugin,
          vulnerabilities.plugin_vulnerabilities[plugin.slug] || []
        ),
        vulnerabilities: (vulnerabilities.plugin_vulnerabilities[plugin.slug] || []).length,
        detected_from: plugin.detected_from,
      })),
      
      themes: wpData.themes.map(theme => ({
        slug: theme.slug,
        name: theme.name,
        version: theme.version,
        latest_version: theme.latest_version,
        status: getComponentStatus(
          theme,
          vulnerabilities.theme_vulnerabilities[theme.slug] || []
        ),
        vulnerabilities: (vulnerabilities.theme_vulnerabilities[theme.slug] || []).length,
        detected_from: theme.detected_from,
      })),
      
      security: securityChecks,
      risk_score: riskScore,
      total_vulnerabilities: vulnerabilities.total_vulnerabilities,
      severity_breakdown: vulnerabilities.severity_breakdown,
      detection_confidence: wpData.scan_metadata.detection_confidence,
      https_enabled: wpData.server.https_enabled,
    };

    console.log(`[WP Scan] Scan complete in ${Date.now() - startTime}ms`, {
      riskScore,
      totalVulns: vulnerabilities.total_vulnerabilities,
    });

    return NextResponse.json(scanResult);

  } catch (error) {
    console.error('[WP Scan] Scan error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scan WordPress site',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Determine core status based on version and vulnerabilities
 */
function getCoreStatus(
  core: WordPressScanData['core'],
  vulnerabilities: any[]
): 'secure' | 'outdated' | 'vulnerable' {
  if (vulnerabilities.length > 0) {
    return 'vulnerable';
  }
  
  if (core.is_outdated) {
    return 'outdated';
  }
  
  return 'secure';
}

/**
 * Determine component status (plugin/theme)
 */
function getComponentStatus(
  component: { is_outdated: boolean },
  vulnerabilities: any[]
): 'secure' | 'outdated' | 'vulnerable' {
  if (vulnerabilities.length > 0) {
    return 'vulnerable';
  }
  
  if (component.is_outdated) {
    return 'outdated';
  }
  
  return 'secure';
}

/**
 * Build security checks array
 */
function buildSecurityChecks(
  wpData: WordPressScanData,
  vulnerabilities: VulnerabilityCheckResult
): string[] {
  const checks: string[] = [];
  
  // HTTPS check
  if (wpData.server.https_enabled) {
    checks.push('✓ SSL/HTTPS Active');
  } else {
    checks.push('⚠️ SSL/HTTPS Not Enabled');
  }
  
  // WordPress version check
  if (wpData.core.version !== 'unknown') {
    if (!wpData.core.is_outdated) {
      checks.push('✓ WordPress Core Up to Date');
    } else {
      checks.push(`⚠️ WordPress Core Outdated (${wpData.core.version} → ${wpData.core.latest_version})`);
    }
  } else {
    checks.push('⚠️ WordPress Version Hidden');
  }
  
  // Plugin status
  const outdatedPlugins = wpData.plugins.filter(p => p.is_outdated).length;
  if (outdatedPlugins > 0) {
    checks.push(`⚠️ ${outdatedPlugins} Outdated Plugin${outdatedPlugins > 1 ? 's' : ''}`);
  } else if (wpData.plugins.length > 0) {
    checks.push('✓ All Plugins Up to Date');
  }
  
  // Theme status
  const outdatedThemes = wpData.themes.filter(t => t.is_outdated).length;
  if (outdatedThemes > 0) {
    checks.push(`⚠️ ${outdatedThemes} Outdated Theme${outdatedThemes > 1 ? 's' : ''}`);
  }
  
  // Vulnerability summary
  if (vulnerabilities.total_vulnerabilities > 0) {
    if (vulnerabilities.severity_breakdown.critical > 0) {
      checks.push(`🚨 ${vulnerabilities.severity_breakdown.critical} Critical Vulnerability${vulnerabilities.severity_breakdown.critical > 1 ? 'ies' : 'y'}`);
    }
    if (vulnerabilities.severity_breakdown.high > 0) {
      checks.push(`⚠️ ${vulnerabilities.severity_breakdown.high} High Severity Vulnerability${vulnerabilities.severity_breakdown.high > 1 ? 'ies' : 'y'}`);
    }
  } else {
    checks.push('✓ No Known Vulnerabilities Detected');
  }
  
  // PHP version check
  if (wpData.server.php_version) {
    const phpMajor = parseInt(wpData.server.php_version.split('.')[0]);
    if (phpMajor < 8) {
      checks.push(`⚠️ PHP ${wpData.server.php_version} (Upgrade Recommended)`);
    } else {
      checks.push(`✓ PHP ${wpData.server.php_version}`);
    }
  }
  
  // Detection confidence
  if (wpData.scan_metadata.detection_confidence < 60) {
    checks.push(`⚠️ Low Detection Confidence (${wpData.scan_metadata.detection_confidence}%)`);
  }
  
  return checks;
}
