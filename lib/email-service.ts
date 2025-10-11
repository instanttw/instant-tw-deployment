/**
 * Email Service
 * Sends email notifications using Resend (or configurable provider)
 */

import { Resend } from 'resend';
import PurchaseConfirmationEmail from './emails/purchase-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendPurchaseEmailParams {
  to: string;
  customerName: string;
  orderNumber: string;
  products: Array<{
    name: string;
    price: string;
  }>;
  licenses: Array<{
    product: string;
    key: string;
  }>;
  totalAmount: string;
  orderDate: string;
}

interface VulnerabilityAlertData {
  userName: string;
  websiteUrl: string;
  vulnerabilityCount: number;
  criticalCount: number;
  highCount: number;
  riskScore: number;
  scanId: string;
  dashboardUrl: string;
  vulnerabilities: Array<{
    severity: string;
    title: string;
    affectedItem: string;
    cveId?: string;
  }>;
}

interface ScanSummaryData {
  userName: string;
  period: string;
  totalScans: number;
  websitesScanned: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  dashboardUrl: string;
  websites: Array<{
    url: string;
    riskScore: number;
    vulnerabilityCount: number;
    lastScanned: string;
  }>;
}

/**
 * Send email using configured provider (Resend by default)
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || 'resend';
  
  if (provider === 'resend') {
    await sendWithResend(options);
  } else if (provider === 'sendgrid') {
    await sendWithSendGrid(options);
  } else {
    console.log('Email sending disabled (no provider configured)');
    console.log('Would send:', options.subject, 'to', options.to);
  }
}

/**
 * Send email via Resend
 */
async function sendWithResend(options: EmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return;
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'WP Scan <noreply@instant.tw>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }
    
    console.log(`✅ Email sent to ${options.to}: ${options.subject}`);
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
}

/**
 * Send email via SendGrid
 */
async function sendWithSendGrid(options: EmailOptions): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY not configured, skipping email');
    return;
  }
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: options.to }],
        }],
        from: {
          email: process.env.EMAIL_FROM || 'noreply@instant.tw',
          name: 'WP Scan',
        },
        subject: options.subject,
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${error}`);
    }
    
    console.log(`✅ Email sent to ${options.to}: ${options.subject}`);
  } catch (error) {
    console.error('Error sending email with SendGrid:', error);
    throw error;
  }
}

/**
 * Send vulnerability alert email
 */
export async function sendVulnerabilityAlert(
  data: VulnerabilityAlertData
): Promise<void> {
  const html = renderVulnerabilityAlertEmail(data);
  const text = renderVulnerabilityAlertText(data);
  
  await sendEmail({
    to: data.userName, // This should be email, but using userName for now
    subject: `🚨 ${data.criticalCount > 0 ? 'Critical' : 'New'} Vulnerabilities Found - ${data.websiteUrl}`,
    html,
    text,
  });
}

/**
 * Send scan summary email
 */
export async function sendScanSummary(
  email: string,
  data: ScanSummaryData
): Promise<void> {
  const html = renderScanSummaryEmail(data);
  const text = renderScanSummaryText(data);
  
  await sendEmail({
    to: email,
    subject: `📊 WP Scan ${data.period} Summary - ${data.totalScans} Scans Completed`,
    html,
    text,
  });
}

/**
 * Send purchase confirmation email with license keys
 */
export async function sendPurchaseConfirmationEmail(params: SendPurchaseEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Instant.tw <orders@instant.tw>',
      to: [params.to],
      subject: `Order Confirmation - ${params.orderNumber}`,
      react: PurchaseConfirmationEmail(params),
    });

    if (error) {
      console.error('❌ Error sending purchase email:', error);
      return { success: false, error };
    }

    console.log('✅ Purchase email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send purchase email:', error);
    return { success: false, error };
  }
}

/**
 * Render vulnerability alert email HTML
 */
function renderVulnerabilityAlertEmail(data: VulnerabilityAlertData): string {
  const severityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#3b82f6';
      default: return '#6b7280';
    }
  };
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vulnerability Alert</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Security Alert</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New vulnerabilities detected</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    
    <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${data.userName},</p>
    
    <p style="font-size: 16px; margin: 0 0 20px 0;">
      We've completed a security scan of <strong>${data.websiteUrl}</strong> and found <strong>${data.vulnerabilityCount} vulnerabilities</strong>.
    </p>
    
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-weight: 600;">Risk Score:</span>
        <span style="font-weight: 700; color: ${data.riskScore >= 70 ? '#ef4444' : data.riskScore >= 40 ? '#f97316' : '#3b82f6'}; font-size: 18px;">${data.riskScore}/100</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Critical:</span>
        <strong style="color: #ef4444;">${data.criticalCount}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>High:</span>
        <strong style="color: #f97316;">${data.highCount}</strong>
      </div>
    </div>
    
    <h3 style="color: #1f2937; margin: 30px 0 15px 0;">Top Vulnerabilities:</h3>
    
    ${data.vulnerabilities.slice(0, 5).map(vuln => `
      <div style="background: #f9fafb; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 3px solid ${severityColor(vuln.severity)};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <strong style="color: #1f2937;">${vuln.title}</strong>
          <span style="background: ${severityColor(vuln.severity)}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600;">${vuln.severity}</span>
        </div>
        <div style="color: #6b7280; font-size: 14px;">
          <span>Affected: ${vuln.affectedItem}</span>
          ${vuln.cveId ? `<span style="margin-left: 10px;">CVE: ${vuln.cveId}</span>` : ''}
        </div>
      </div>
    `).join('')}
    
    ${data.vulnerabilities.length > 5 ? `
      <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 15px 0;">
        And ${data.vulnerabilities.length - 5} more vulnerabilities...
      </p>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0 20px 0;">
      <a href="${data.dashboardUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;">View Full Report</a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #6b7280; margin: 0;">
      This is an automated security alert from WP Scan. To manage your notification preferences, visit your <a href="${data.dashboardUrl.replace(/\/scan\/.*/, '/settings')}" style="color: #667eea;">dashboard settings</a>.
    </p>
  </div>
  
</body>
</html>
  `;
}

/**
 * Render vulnerability alert email plain text
 */
function renderVulnerabilityAlertText(data: VulnerabilityAlertData): string {
  return `
Security Alert: New Vulnerabilities Detected

Hi ${data.userName},

We've completed a security scan of ${data.websiteUrl} and found ${data.vulnerabilityCount} vulnerabilities.

Risk Score: ${data.riskScore}/100
Critical: ${data.criticalCount}
High: ${data.highCount}

Top Vulnerabilities:
${data.vulnerabilities.slice(0, 5).map(vuln => `
- [${vuln.severity}] ${vuln.title}
  Affected: ${vuln.affectedItem}${vuln.cveId ? ` (${vuln.cveId})` : ''}
`).join('\n')}

View full report: ${data.dashboardUrl}

---
This is an automated security alert from WP Scan.
  `.trim();
}

/**
 * Render scan summary email HTML
 */
function renderScanSummaryEmail(data: ScanSummaryData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scan Summary</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">📊 ${data.period} Summary</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your website security overview</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    
    <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${data.userName},</p>
    
    <p style="font-size: 16px; margin: 0 0 20px 0;">
      Here's your ${data.period.toLowerCase()} security summary for your monitored websites.
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 25px 0;">
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #0284c7;">${data.totalScans}</div>
        <div style="font-size: 12px; color: #64748b;">Scans</div>
      </div>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #d97706;">${data.websitesScanned}</div>
        <div style="font-size: 12px; color: #64748b;">Websites</div>
      </div>
      <div style="background: #fee2e2; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #dc2626;">${data.totalVulnerabilities}</div>
        <div style="font-size: 12px; color: #64748b;">Issues</div>
      </div>
    </div>
    
    <h3 style="color: #1f2937; margin: 30px 0 15px 0;">Website Status:</h3>
    
    ${data.websites.map(site => `
      <div style="background: #f9fafb; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <strong style="color: #1f2937; font-size: 14px;">${site.url}</strong>
          <span style="background: ${site.riskScore >= 70 ? '#ef4444' : site.riskScore >= 40 ? '#f97316' : '#10b981'}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600;">${site.riskScore}</span>
        </div>
        <div style="color: #6b7280; font-size: 13px;">
          ${site.vulnerabilityCount} vulnerabilities • Last scanned: ${site.lastScanned}
        </div>
      </div>
    `).join('')}
    
    <div style="text-align: center; margin: 30px 0 20px 0;">
      <a href="${data.dashboardUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;">View Dashboard</a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #6b7280; margin: 0;">
      This is your automated ${data.period.toLowerCase()} summary from WP Scan.
    </p>
  </div>
  
</body>
</html>
  `;
}

/**
 * Render scan summary email plain text
 */
function renderScanSummaryText(data: ScanSummaryData): string {
  return `
${data.period} Security Summary

Hi ${data.userName},

Here's your ${data.period.toLowerCase()} security summary:

Stats:
- Total Scans: ${data.totalScans}
- Websites Scanned: ${data.websitesScanned}
- Total Vulnerabilities: ${data.totalVulnerabilities}

Website Status:
${data.websites.map(site => `
- ${site.url} (Risk: ${site.riskScore})
  ${site.vulnerabilityCount} vulnerabilities • Last scanned: ${site.lastScanned}
`).join('\n')}

View dashboard: ${data.dashboardUrl}

---
This is your automated ${data.period.toLowerCase()} summary from WP Scan.
  `.trim();
}
