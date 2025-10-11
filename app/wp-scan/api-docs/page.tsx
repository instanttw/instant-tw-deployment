"use client";

import { motion } from "framer-motion";
import { Code, Lock, Zap, Webhook, Key, Database, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WPScanAPIDocsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/wp-scan" className="text-sm text-primary hover:underline mb-4 inline-block">
            ← Back to WP Scan
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">WP Scan API Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Integrate WordPress vulnerability scanning into your workflow with our flexible REST APIavailable exclusively with Enterprise plans.
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Overview</CardTitle>
            <CardDescription>RESTful API for automated WordPress security scanning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Secure Authentication</h4>
                    <p className="text-sm text-muted-foreground">Bearer token authentication with API key rotation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">High Performance</h4>
                    <p className="text-sm text-muted-foreground">99.9% uptime SLA with low latency responses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Webhook className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Webhooks</h4>
                    <p className="text-sm text-muted-foreground">Real-time notifications via Slack & HTTP</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Comprehensive Data</h4>
                    <p className="text-sm text-muted-foreground">CVSS scores, CVE IDs, and PoC exploit data</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Base URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 p-4 rounded-lg font-mono text-sm">
              https://api.wp.instant.tw/v1
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">All API requests require authentication using a Bearer token in the Authorization header:</p>
            <div className="bg-secondary/30 p-4 rounded-lg font-mono text-sm mb-4">
              Authorization: Bearer YOUR_API_KEY
            </div>
            <p className="text-sm text-muted-foreground">
              You can generate API keys from your Enterprise dashboard after subscribing.
            </p>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="mb-8 space-y-6">
          <h2 className="text-2xl font-bold">API Endpoints</h2>

          {/* Scan Website */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scan Website</CardTitle>
                <span className="text-xs font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                  POST
                </span>
              </div>
              <CardDescription className="font-mono text-sm">/scan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Initiate a security scan for a WordPress website.</p>
              
              <h4 className="font-medium mb-2">Request Body:</h4>
              <pre className="bg-secondary/30 p-4 rounded-lg text-sm overflow-x-auto mb-4">
{`{
  "url": "https://example.com",
  "deep_scan": true,
  "include_themes": true,
  "include_plugins": true
}`}
              </pre>

              <h4 className="font-medium mb-2">Response (200 OK):</h4>
              <pre className="bg-secondary/30 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "scan_id": "scan_abc123",
  "url": "https://example.com",
  "status": "completed",
  "risk_score": 85,
  "vulnerabilities_found": 3,
  "scanned_at": "2024-01-15T10:30:00Z",
  "wordpress": {
    "version": "6.4.2",
    "status": "secure",
    "vulnerabilities": []
  },
  "plugins": [
    {
      "name": "Contact Form 7",
      "version": "5.8.4",
      "status": "outdated",
      "vulnerabilities": [
        {
          "id": "CVE-2024-0198",
          "title": "CSRF to Arbitrary File Upload",
          "severity": "High",
          "cvss_score": 8.1,
          "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N",
          "published": "2024-01-10",
          "fixed_version": "5.8.6",
          "references": ["https://cve.mitre.org/CVE-2024-0198"],
          "poc_available": true
        }
      ]
    }
  ],
  "themes": []
}`}
              </pre>
            </CardContent>
          </Card>

          {/* Get Scan Result */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Get Scan Result</CardTitle>
                <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  GET
                </span>
              </div>
              <CardDescription className="font-mono text-sm">/scan/:scan_id</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Retrieve results from a previous scan by scan ID.</p>
              
              <h4 className="font-medium mb-2">Example Request:</h4>
              <pre className="bg-secondary/30 p-4 rounded-lg text-sm overflow-x-auto">
{`GET /scan/scan_abc123
Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </CardContent>
          </Card>

          {/* List Scans */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>List Scans</CardTitle>
                <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  GET
                </span>
              </div>
              <CardDescription className="font-mono text-sm">/scans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">List all scans with optional filters.</p>
              
              <h4 className="font-medium mb-2">Query Parameters:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                <li><code className="bg-secondary px-1 py-0.5 rounded">page</code> - Page number (default: 1)</li>
                <li><code className="bg-secondary px-1 py-0.5 rounded">limit</code> - Results per page (default: 20)</li>
                <li><code className="bg-secondary px-1 py-0.5 rounded">status</code> - Filter by status (pending, completed, failed)</li>
                <li><code className="bg-secondary px-1 py-0.5 rounded">url</code> - Filter by URL</li>
              </ul>
            </CardContent>
          </Card>

          {/* Get Vulnerability by ID */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Get Vulnerability Details</CardTitle>
                <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  GET
                </span>
              </div>
              <CardDescription className="font-mono text-sm">/vulnerability/:cve_id</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get detailed information about a specific vulnerability.</p>
              
              <h4 className="font-medium mb-2">Response Fields:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>CVE/WPScan ID</li>
                <li>CVSS Score and Vector</li>
                <li>Affected versions</li>
                <li>Proof of Concept (PoC) code</li>
                <li>Remediation steps</li>
                <li>External references</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Webhooks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <CardDescription>Configure real-time notifications for vulnerability discoveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Supported Webhook Types:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Scan completed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">New vulnerability detected</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Critical security alert</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Example Webhook Payload:</h4>
                <pre className="bg-secondary/30 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "event": "vulnerability_detected",
  "timestamp": "2024-01-15T10:30:00Z",
  "scan_id": "scan_abc123",
  "url": "https://example.com",
  "vulnerability": {
    "id": "CVE-2024-0198",
    "title": "CSRF to Arbitrary File Upload",
    "severity": "High",
    "cvss_score": 8.1,
    "plugin": "Contact Form 7",
    "affected_version": "5.8.4",
    "fixed_version": "5.8.6"
  }
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">Slack Integration:</h4>
                <p className="text-sm text-muted-foreground">
                  Configure Slack webhooks to receive vulnerability alerts directly in your team channels. Full formatting support for rich notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><strong>Enterprise Plan:</strong> 10,000 requests/hour</p>
              <p className="text-sm"><strong>Rate limit headers:</strong></p>
              <pre className="bg-secondary/30 p-4 rounded-lg text-sm overflow-x-auto">
{`X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9995
X-RateLimit-Reset: 1705320000`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Error Codes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Error Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-secondary/30 rounded">
                <code>400</code>
                <span>Bad Request - Invalid parameters</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary/30 rounded">
                <code>401</code>
                <span>Unauthorized - Invalid API key</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary/30 rounded">
                <code>403</code>
                <span>Forbidden - Insufficient permissions</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary/30 rounded">
                <code>404</code>
                <span>Not Found - Resource doesn't exist</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary/30 rounded">
                <code>429</code>
                <span>Too Many Requests - Rate limit exceeded</span>
              </div>
              <div className="flex justify-between p-2 bg-secondary/30 rounded">
                <code>500</code>
                <span>Internal Server Error</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                The WP Scan API is available exclusively with Enterprise plans at $599/month. Get full access to our API, webhooks, and premium features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/wp-scan#pricing">View All Plans</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help? Contact our Enterprise support team at <a href="mailto:enterprise@instant.tw" className="text-primary hover:underline">enterprise@instant.tw</a></p>
          <p className="mt-2">API Version: v1 • Documentation last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
}
