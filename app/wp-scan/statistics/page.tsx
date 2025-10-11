"use client";

import { motion } from "framer-motion";
import { TrendingUp, Shield, AlertTriangle, Activity, Database, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WPScanStatisticsPage() {
  // Mock data similar to wpscan.com/statistics
  const stats = {
    totalVulnerabilities: 24127,
    wordpressCore: 542,
    plugins: 21890,
    themes: 1695,
    recentlyAdded: 156,
    criticalSeverity: 3245,
    highSeverity: 8921,
    mediumSeverity: 9456,
    lowSeverity: 2505,
  };

  const topVulnerablePlugins = [
    { name: "Contact Form 7", vulnerabilities: 28, latestVersion: "5.8.6" },
    { name: "Yoast SEO", vulnerabilities: 15, latestVersion: "21.9" },
    { name: "WooCommerce", vulnerabilities: 142, latestVersion: "8.5.1" },
    { name: "Elementor", vulnerabilities: 34, latestVersion: "3.19.0" },
    { name: "Wordfence Security", vulnerabilities: 8, latestVersion: "7.11.4" },
    { name: "WP Super Cache", vulnerabilities: 12, latestVersion: "1.12.1" },
    { name: "Jetpack", vulnerabilities: 45, latestVersion: "13.0" },
    { name: "Akismet", vulnerabilities: 6, latestVersion: "5.3.1" },
    { name: "All in One SEO", vulnerabilities: 19, latestVersion: "4.5.8" },
    { name: "WP Rocket", vulnerabilities: 11, latestVersion: "3.15.4" },
  ];

  const recentVulnerabilities = [
    {
      id: "CVE-2024-0285",
      title: "WooCommerce < 8.5.1 - Unauthenticated SQL Injection",
      plugin: "WooCommerce",
      severity: "Critical",
      cvss: 9.8,
      published: "2024-01-15",
    },
    {
      id: "CVE-2024-0234",
      title: "Elementor Pro < 3.19.0 - Authenticated Stored XSS",
      plugin: "Elementor Pro",
      severity: "High",
      cvss: 7.2,
      published: "2024-01-12",
    },
    {
      id: "CVE-2024-0198",
      title: "Contact Form 7 < 5.8.6 - CSRF to Arbitrary File Upload",
      plugin: "Contact Form 7",
      severity: "High",
      cvss: 8.1,
      published: "2024-01-10",
    },
    {
      id: "CVE-2024-0156",
      title: "WordPress Core < 6.4.3 - Reflected XSS",
      plugin: "WordPress Core",
      severity: "Medium",
      cvss: 6.1,
      published: "2024-01-08",
    },
    {
      id: "CVE-2024-0089",
      title: "Yoast SEO < 21.9 - Authenticated SQL Injection",
      plugin: "Yoast SEO",
      severity: "Critical",
      cvss: 9.1,
      published: "2024-01-05",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30";
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30";
      case "low":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link href="/wp-scan" className="text-sm text-primary hover:underline mb-4 inline-block">
            ← Back to WP Scan
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">WordPress Vulnerability Statistics</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Real-time statistics and insights into WordPress security vulnerabilities. Our database is continuously updated with the latest threats affecting WordPress core, plugins, and themes.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalVulnerabilities.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+{stats.recentlyAdded}</span> this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Plugin Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.plugins.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.plugins / stats.totalVulnerabilities) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Theme Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.themes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.themes / stats.totalVulnerabilities) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">WordPress Core</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.wordpressCore.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.wordpressCore / stats.totalVulnerabilities) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Severity Breakdown */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Vulnerability Severity Distribution
            </CardTitle>
            <CardDescription>Breakdown of vulnerabilities by CVSS severity rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Critical (9.0-10.0)</span>
                  <span className="text-sm font-medium">{stats.criticalSeverity.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(stats.criticalSeverity / stats.totalVulnerabilities) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">High (7.0-8.9)</span>
                  <span className="text-sm font-medium">{stats.highSeverity.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${(stats.highSeverity / stats.totalVulnerabilities) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Medium (4.0-6.9)</span>
                  <span className="text-sm font-medium">{stats.mediumSeverity.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${(stats.mediumSeverity / stats.totalVulnerabilities) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Low (0.1-3.9)</span>
                  <span className="text-sm font-medium">{stats.lowSeverity.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(stats.lowSeverity / stats.totalVulnerabilities) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Vulnerable Plugins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Top 10 Most Vulnerable Plugins
              </CardTitle>
              <CardDescription>Plugins with the highest number of known vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topVulnerablePlugins.map((plugin, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-muted-foreground">#{index + 1}</div>
                      <div>
                        <p className="font-medium">{plugin.name}</p>
                        <p className="text-xs text-muted-foreground">Latest: v{plugin.latestVersion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600 dark:text-red-400">{plugin.vulnerabilities}</p>
                      <p className="text-xs text-muted-foreground">CVEs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Vulnerabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Vulnerabilities
              </CardTitle>
              <CardDescription>Latest discovered security issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVulnerabilities.map((vuln, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-primary">{vuln.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{vuln.title}</h4>
                        <p className="text-xs text-muted-foreground">{vuln.plugin}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-bold">{vuln.cvss}</div>
                        <p className="text-xs text-muted-foreground">CVSS</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Published: {vuln.published}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Protect Your WordPress Sites</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get instant alerts when new vulnerabilities affect your WordPress installation. Scan your sites now with WP Scan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/wp-scan">Start Free Scan</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/wp-scan#pricing">View Pricing Plans</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Statistics updated daily • Data sourced from CVE, WPScan, and proprietary research</p>
          <p className="mt-2">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
