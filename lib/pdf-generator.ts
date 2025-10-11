/**
 * PDF Report Generator
 * Generates security scan reports in PDF format
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScanData {
  id: string;
  websiteUrl: string;
  scannedAt: string;
  riskScore: number;
  core: {
    version: string;
    latestVersion?: string;
    isOutdated?: boolean;
  };
  plugins: Array<{
    name: string;
    version: string;
    latestVersion?: string;
    isOutdated?: boolean;
  }>;
  themes: Array<{
    name: string;
    version: string;
    latestVersion?: string;
    isOutdated?: boolean;
  }>;
  findings: Array<{
    severity: string;
    title: string;
    description: string;
    affectedItem: string;
    affectedVersion?: string;
    fixedIn?: string;
    cveId?: string;
    cvssScore?: number;
  }>;
}

interface WhiteLabelOptions {
  companyName?: string;
  companyLogo?: string; // Base64 encoded image
  hideInstantBranding?: boolean;
  primaryColor?: string;
}

interface ReportOptions {
  includeDetails: boolean;
  includeCVSS: boolean;
  whiteLabel?: WhiteLabelOptions;
}

/**
 * Generate PDF report for a scan
 */
export async function generateScanReport(
  scanData: ScanData,
  options: ReportOptions
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const primaryColor = options.whiteLabel?.primaryColor || '#667eea';
  let yPos = 20;
  
  // Header
  yPos = addHeader(doc, scanData, options, yPos);
  
  // Executive Summary
  yPos = addExecutiveSummary(doc, scanData, yPos);
  
  // Risk Assessment
  yPos = addRiskAssessment(doc, scanData, yPos);
  
  // WordPress Core Status
  yPos = addCoreStatus(doc, scanData, yPos);
  
  // Plugins Status
  if (scanData.plugins.length > 0) {
    yPos = addPluginsStatus(doc, scanData, yPos);
  }
  
  // Themes Status
  if (scanData.themes.length > 0) {
    yPos = addThemesStatus(doc, scanData, yPos);
  }
  
  // Vulnerabilities
  if (scanData.findings.length > 0) {
    yPos = addVulnerabilities(doc, scanData, options, yPos);
  }
  
  // Recommendations
  yPos = addRecommendations(doc, scanData, yPos);
  
  // Footer
  addFooter(doc, scanData, options);
  
  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

/**
 * Add header to PDF
 */
function addHeader(doc: jsPDF, scanData: ScanData, options: ReportOptions, yPos: number): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add logo if white label
  if (options.whiteLabel?.companyLogo) {
    doc.addImage(options.whiteLabel.companyLogo, 'PNG', 20, yPos, 30, 10);
  }
  
  // Company name or WP Scan
  const brandName = options.whiteLabel?.companyName || 'WP Scan';
  doc.setFontSize(24);
  doc.setTextColor(103, 126, 234);
  doc.text(brandName, options.whiteLabel?.companyLogo ? 55 : 20, yPos + 8);
  
  // Report title
  doc.setFontSize(16);
  doc.setTextColor(51, 51, 51);
  doc.text('WordPress Security Report', 20, yPos + 20);
  
  // Website URL
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text(scanData.websiteUrl, 20, yPos + 28);
  
  // Scan date
  const scanDate = new Date(scanData.scannedAt).toLocaleString();
  doc.text(`Scanned: ${scanDate}`, 20, yPos + 35);
  
  // Horizontal line
  doc.setDrawColor(229, 231, 235);
  doc.line(20, yPos + 40, pageWidth - 20, yPos + 40);
  
  return yPos + 50;
}

/**
 * Add executive summary
 */
function addExecutiveSummary(doc: jsPDF, scanData: ScanData, yPos: number): number {
  checkPageBreak(doc, yPos, 50);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Executive Summary', 20, yPos);
  
  yPos += 10;
  
  const criticalCount = scanData.findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = scanData.findings.filter(f => f.severity === 'HIGH').length;
  const mediumCount = scanData.findings.filter(f => f.severity === 'MEDIUM').length;
  const lowCount = scanData.findings.filter(f => f.severity === 'LOW').length;
  
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  
  const summaryText = `This report provides a comprehensive security assessment of ${scanData.websiteUrl}. ` +
    `The scan identified ${scanData.findings.length} security ${scanData.findings.length === 1 ? 'issue' : 'issues'} ` +
    `with an overall risk score of ${scanData.riskScore}/100.`;
  
  const lines = doc.splitTextToSize(summaryText, 170);
  doc.text(lines, 20, yPos);
  
  return yPos + (lines.length * 5) + 10;
}

/**
 * Add risk assessment
 */
function addRiskAssessment(doc: jsPDF, scanData: ScanData, yPos: number): number {
  checkPageBreak(doc, yPos, 60);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Risk Assessment', 20, yPos);
  
  yPos += 10;
  
  // Risk score box
  const riskColor = getRiskColor(scanData.riskScore);
  doc.setFillColor(riskColor.r, riskColor.g, riskColor.b);
  doc.roundedRect(20, yPos, 50, 30, 3, 3, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(`${scanData.riskScore}`, 35, yPos + 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text('Risk Score', 35, yPos + 23, { align: 'center' });
  
  // Severity breakdown
  const criticalCount = scanData.findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = scanData.findings.filter(f => f.severity === 'HIGH').length;
  const mediumCount = scanData.findings.filter(f => f.severity === 'MEDIUM').length;
  const lowCount = scanData.findings.filter(f => f.severity === 'LOW').length;
  
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  
  doc.text('Critical:', 80, yPos + 8);
  doc.setTextColor(239, 68, 68);
  doc.text(criticalCount.toString(), 110, yPos + 8);
  
  doc.setTextColor(75, 85, 99);
  doc.text('High:', 80, yPos + 15);
  doc.setTextColor(249, 115, 22);
  doc.text(highCount.toString(), 110, yPos + 15);
  
  doc.setTextColor(75, 85, 99);
  doc.text('Medium:', 80, yPos + 22);
  doc.setTextColor(234, 179, 8);
  doc.text(mediumCount.toString(), 110, yPos + 22);
  
  doc.setTextColor(75, 85, 99);
  doc.text('Low:', 80, yPos + 29);
  doc.setTextColor(59, 130, 246);
  doc.text(lowCount.toString(), 110, yPos + 29);
  
  return yPos + 40;
}

/**
 * Add WordPress core status
 */
function addCoreStatus(doc: jsPDF, scanData: ScanData, yPos: number): number {
  checkPageBreak(doc, yPos, 40);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('WordPress Core', 20, yPos);
  
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Component', 'Current Version', 'Latest Version', 'Status']],
    body: [[
      'WordPress Core',
      scanData.core.version,
      scanData.core.latestVersion || 'Unknown',
      scanData.core.isOutdated ? '⚠️ Outdated' : '✓ Up to date'
    ]],
    theme: 'grid',
    headStyles: { fillColor: [103, 126, 234], textColor: [255, 255, 255] },
    margin: { left: 20, right: 20 },
  });
  
  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add plugins status
 */
function addPluginsStatus(doc: jsPDF, scanData: ScanData, yPos: number): number {
  checkPageBreak(doc, yPos, 40);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Plugins', 20, yPos);
  
  yPos += 10;
  
  const pluginRows = scanData.plugins.map(plugin => [
    plugin.name,
    plugin.version,
    plugin.latestVersion || 'Unknown',
    plugin.isOutdated ? '⚠️ Outdated' : '✓ Up to date'
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Plugin Name', 'Current Version', 'Latest Version', 'Status']],
    body: pluginRows,
    theme: 'grid',
    headStyles: { fillColor: [103, 126, 234], textColor: [255, 255, 255] },
    margin: { left: 20, right: 20 },
  });
  
  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add themes status
 */
function addThemesStatus(doc: jsPDF, scanData: ScanData, yPos: number): number {
  checkPageBreak(doc, yPos, 40);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Themes', 20, yPos);
  
  yPos += 10;
  
  const themeRows = scanData.themes.map(theme => [
    theme.name,
    theme.version,
    theme.latestVersion || 'Unknown',
    theme.isOutdated ? '⚠️ Outdated' : '✓ Up to date'
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Theme Name', 'Current Version', 'Latest Version', 'Status']],
    body: themeRows,
    theme: 'grid',
    headStyles: { fillColor: [103, 126, 234], textColor: [255, 255, 255] },
    margin: { left: 20, right: 20 },
  });
  
  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add vulnerabilities
 */
function addVulnerabilities(doc: jsPDF, scanData: ScanData, options: ReportOptions, yPos: number): number {
  checkPageBreak(doc, yPos, 40);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Vulnerabilities', 20, yPos);
  
  yPos += 10;
  
  // Sort by severity
  const sortedFindings = [...scanData.findings].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
  });
  
  const findingRows = sortedFindings.map(finding => {
    const row: any[] = [
      finding.severity,
      finding.title,
      finding.affectedItem,
    ];
    
    if (options.includeCVSS && finding.cvssScore) {
      row.push(finding.cvssScore.toString());
    }
    
    if (finding.cveId) {
      row.push(finding.cveId);
    } else {
      row.push('-');
    }
    
    return row;
  });
  
  const headers = ['Severity', 'Vulnerability', 'Affected'];
  if (options.includeCVSS) {
    headers.push('CVSS');
  }
  headers.push('CVE ID');
  
  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body: findingRows,
    theme: 'grid',
    headStyles: { fillColor: [103, 126, 234], textColor: [255, 255, 255] },
    margin: { left: 20, right: 20 },
    styles: { fontSize: 8 },
    didParseCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 0) {
        const severity = data.cell.raw;
        const colors: any = {
          CRITICAL: [239, 68, 68],
          HIGH: [249, 115, 22],
          MEDIUM: [234, 179, 8],
          LOW: [59, 130, 246],
        };
        if (colors[severity]) {
          data.cell.styles.textColor = colors[severity];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });
  
  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add recommendations
 */
function addRecommendations(doc: jsPDF, scanData: ScanData, yPos: number): number {
  checkPageBreak(doc, yPos, 60);
  
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Recommendations', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  
  const recommendations: string[] = [];
  
  if (scanData.core.isOutdated) {
    recommendations.push('• Update WordPress core to the latest version');
  }
  
  const outdatedPlugins = scanData.plugins.filter(p => p.isOutdated).length;
  if (outdatedPlugins > 0) {
    recommendations.push(`• Update ${outdatedPlugins} outdated ${outdatedPlugins === 1 ? 'plugin' : 'plugins'}`);
  }
  
  const outdatedThemes = scanData.themes.filter(t => t.isOutdated).length;
  if (outdatedThemes > 0) {
    recommendations.push(`• Update ${outdatedThemes} outdated ${outdatedThemes === 1 ? 'theme' : 'themes'}`);
  }
  
  const criticalVulns = scanData.findings.filter(f => f.severity === 'CRITICAL').length;
  if (criticalVulns > 0) {
    recommendations.push(`• Address ${criticalVulns} critical ${criticalVulns === 1 ? 'vulnerability' : 'vulnerabilities'} immediately`);
  }
  
  recommendations.push('• Regular backups before updates');
  recommendations.push('• Enable automatic security updates');
  recommendations.push('• Use strong passwords and two-factor authentication');
  recommendations.push('• Regular security monitoring');
  
  recommendations.forEach((rec, index) => {
    const lines = doc.splitTextToSize(rec, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 5;
  });
  
  return yPos + 10;
}

/**
 * Add footer to all pages
 */
function addFooter(doc: jsPDF, scanData: ScanData, options: ReportOptions): void {
  const pageCount = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(229, 231, 235);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    
    if (!options.whiteLabel?.hideInstantBranding) {
      doc.text('Generated by WP Scan - wp.instant.tw', 20, pageHeight - 15);
    }
    
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
  }
}

/**
 * Check if page break is needed
 */
function checkPageBreak(doc: jsPDF, yPos: number, requiredSpace: number): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  
  if (yPos + requiredSpace > pageHeight - 30) {
    doc.addPage();
  }
}

/**
 * Get risk color based on score
 */
function getRiskColor(score: number): { r: number; g: number; b: number } {
  if (score >= 70) {
    return { r: 239, g: 68, b: 68 }; // Red
  } else if (score >= 40) {
    return { r: 249, g: 115, b: 22 }; // Orange
  } else {
    return { r: 16, g: 185, b: 129 }; // Green
  }
}
