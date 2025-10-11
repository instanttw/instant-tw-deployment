/**
 * Slack Notification Service
 * Sends notifications to Slack via incoming webhooks
 */

interface SlackNotification {
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  url?: string;
  fields?: Array<{
    title: string;
    value: string;
    short?: boolean;
  }>;
}

interface SlackAttachment {
  color: string;
  title: string;
  text: string;
  fields?: Array<{
    title: string;
    value: string;
    short: boolean;
  }>;
  actions?: Array<{
    type: string;
    text: string;
    url: string;
  }>;
  footer?: string;
  ts?: number;
}

/**
 * Send notification to Slack webhook
 */
export async function sendSlackNotification(
  webhookUrl: string,
  notification: SlackNotification
): Promise<void> {
  if (!webhookUrl) {
    console.warn('Slack webhook URL not configured');
    return;
  }

  try {
    const color = getSeverityColor(notification.severity);
    
    const attachment: SlackAttachment = {
      color,
      title: notification.title,
      text: notification.message,
      fields: (notification.fields || []).map(f => ({
        title: f.title,
        value: f.value,
        short: f.short ?? false,
      })),
      footer: 'WP Scan Security Monitor',
      ts: Math.floor(Date.now() / 1000),
    };

    // Add action button if URL provided
    if (notification.url) {
      attachment.actions = [
        {
          type: 'button',
          text: 'View Details',
          url: notification.url,
        },
      ];
    }

    const payload = {
      attachments: [attachment],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Slack API error: ${error}`);
    }

    console.log('✅ Slack notification sent successfully');
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    throw error;
  }
}

/**
 * Send vulnerability alert to Slack
 */
export async function sendSlackVulnerabilityAlert(
  webhookUrl: string,
  data: {
    websiteUrl: string;
    vulnerabilityCount: number;
    criticalCount: number;
    highCount: number;
    riskScore: number;
    dashboardUrl: string;
  }
): Promise<void> {
  const severity = data.criticalCount > 0 ? 'CRITICAL' : 
                   data.highCount > 0 ? 'HIGH' : 
                   'MEDIUM';

  const emoji = severity === 'CRITICAL' ? '🚨' : 
                severity === 'HIGH' ? '⚠️' : 
                '⚡';

  await sendSlackNotification(webhookUrl, {
    title: `${emoji} Security Alert: ${data.websiteUrl}`,
    message: `Found ${data.vulnerabilityCount} vulnerabilities with a risk score of ${data.riskScore}/100`,
    severity,
    url: data.dashboardUrl,
    fields: [
      {
        title: 'Risk Score',
        value: `${data.riskScore}/100`,
        short: true,
      },
      {
        title: 'Total Issues',
        value: data.vulnerabilityCount.toString(),
        short: true,
      },
      {
        title: 'Critical',
        value: data.criticalCount.toString(),
        short: true,
      },
      {
        title: 'High',
        value: data.highCount.toString(),
        short: true,
      },
    ],
  });
}

/**
 * Send scan complete notification to Slack
 */
export async function sendSlackScanComplete(
  webhookUrl: string,
  data: {
    websiteUrl: string;
    riskScore: number;
    vulnerabilityCount: number;
    dashboardUrl: string;
  }
): Promise<void> {
  const severity = data.riskScore >= 70 ? 'HIGH' : 
                   data.riskScore >= 40 ? 'MEDIUM' : 
                   'LOW';

  const emoji = data.vulnerabilityCount === 0 ? '✅' : 
                data.riskScore >= 70 ? '🚨' : 
                '⚠️';

  const message = data.vulnerabilityCount === 0 
    ? 'No vulnerabilities found. Site is secure! ✅'
    : `Found ${data.vulnerabilityCount} vulnerabilities`;

  await sendSlackNotification(webhookUrl, {
    title: `${emoji} Scan Complete: ${data.websiteUrl}`,
    message,
    severity,
    url: data.dashboardUrl,
    fields: [
      {
        title: 'Risk Score',
        value: `${data.riskScore}/100`,
        short: true,
      },
      {
        title: 'Vulnerabilities',
        value: data.vulnerabilityCount.toString(),
        short: true,
      },
    ],
  });
}

/**
 * Send weekly summary to Slack
 */
export async function sendSlackWeeklySummary(
  webhookUrl: string,
  data: {
    totalScans: number;
    websitesScanned: number;
    totalVulnerabilities: number;
    criticalVulnerabilities: number;
    dashboardUrl: string;
  }
): Promise<void> {
  const severity = data.criticalVulnerabilities > 0 ? 'CRITICAL' : 
                   data.totalVulnerabilities > 10 ? 'HIGH' : 
                   'LOW';

  await sendSlackNotification(webhookUrl, {
    title: '📊 Weekly Security Summary',
    message: `Your weekly WordPress security report is ready`,
    severity,
    url: data.dashboardUrl,
    fields: [
      {
        title: 'Scans Performed',
        value: data.totalScans.toString(),
        short: true,
      },
      {
        title: 'Websites',
        value: data.websitesScanned.toString(),
        short: true,
      },
      {
        title: 'Total Issues',
        value: data.totalVulnerabilities.toString(),
        short: true,
      },
      {
        title: 'Critical',
        value: data.criticalVulnerabilities.toString(),
        short: true,
      },
    ],
  });
}

/**
 * Test Slack webhook connection
 */
export async function testSlackWebhook(webhookUrl: string): Promise<boolean> {
  try {
    await sendSlackNotification(webhookUrl, {
      title: '✅ WP Scan Connected!',
      message: 'Your Slack integration is working correctly. You will receive security alerts here.',
      severity: 'LOW',
    });
    return true;
  } catch (error) {
    console.error('Slack webhook test failed:', error);
    return false;
  }
}

/**
 * Get color for severity level
 */
function getSeverityColor(severity: string): string {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return '#dc2626'; // Red
    case 'HIGH':
      return '#f97316'; // Orange
    case 'MEDIUM':
      return '#eab308'; // Yellow
    case 'LOW':
      return '#10b981'; // Green
    default:
      return '#6b7280'; // Gray
  }
}
