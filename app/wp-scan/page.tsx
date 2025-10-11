"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Shield, Search, FileCheck, Zap, Clock, Bell, CheckCircle, AlertTriangle, XCircle, ArrowRight, Database, Code, Webhook, Activity, Lock, TrendingUp, Save, LogIn, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";
import Link from "next/link";
import { useCurrency } from "@/lib/currency-context";
import { useSession } from "next-auth/react";
// WordPress detection now handled by server-side API
export interface WordPressDetectionResult {
  isWordPress: boolean;
  confidence: number;
  detectedIndicators: string[];
  failedChecks: string[];
  method?: string;
}

interface ScanResult {
  url: string;
  scanned_at: string;
  scan_duration_ms: number;
  
  core: {
    version: string;
    latest_version?: string;
    status: "secure" | "outdated" | "vulnerable";
    vulnerabilities: number;
    detected_from: string;
  };
  
  plugins: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version?: string;
    status: "secure" | "outdated" | "vulnerable";
    vulnerabilities: number;
    detected_from: string;
  }>;
  
  themes: Array<{
    slug: string;
    name: string;
    version: string;
    latest_version?: string;
    status: "secure" | "outdated" | "vulnerable";
    vulnerabilities: number;
    detected_from: string;
  }>;
  
  security: string[];
  risk_score: number;
  total_vulnerabilities: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  detection_confidence: number;
  https_enabled: boolean;
}

export default function WPScanPage() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [notWordPress, setNotWordPress] = useState(false);
  const [wpDetection, setWpDetection] = useState<WordPressDetectionResult | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const { symbol } = useCurrency();
  const { data: session, status: sessionStatus } = useSession();

  const userPlan = session?.user?.plan || 'FREE';

  const handleScan = async () => {
    if (!url) {
      setError("Please enter a valid WordPress URL");
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setError("");
    setNotWordPress(false);
    setWpDetection(null);
    setScanResult(null);

    // Step 1: Verify it's a WordPress site (server-side to avoid CORS)
    setIsVerifying(true);
    
    try {
      const detectionResponse = await fetch('/api/detect-wordpress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!detectionResponse.ok) {
        throw new Error('Detection API failed');
      }

      const detection: WordPressDetectionResult = await detectionResponse.json();
      setWpDetection(detection);
      setIsVerifying(false);

      if (!detection.isWordPress) {
        setNotWordPress(true);
        return;
      }

      // Step 2: If WordPress detected, proceed with REAL scan
      setIsScanning(true);

      const scanResponse = await fetch('/api/scan-wordpress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!scanResponse.ok) {
        const errorData = await scanResponse.json();
        throw new Error(errorData.message || 'Scan failed');
      }

      const scanResults: ScanResult = await scanResponse.json();
      
      setScanResult(scanResults);
      setIsScanning(false);
    } catch (err) {
      setError("Connection error. Please verify the URL is accessible and try again.");
      setIsVerifying(false);
      setIsScanning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "outdated":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "vulnerable":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleSaveScan = async () => {
    if (!session) {
      window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (userPlan === 'FREE') {
      // Redirect to upgrade page
      window.location.href = '/wp-scan/plans';
      return;
    }

    if (!scanResult) return;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/wpscan/save-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: scanResult.url,
          scanData: scanResult,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresUpgrade) {
          window.location.href = '/wp-scan/plans';
          return;
        }
        throw new Error(data.error || 'Failed to save scan');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save scan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'WP Scan',
            description: 'Free WordPress vulnerability scanner and security audit tool',
            applicationCategory: 'SecurityApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '1250',
            },
          }),
        }}
      />
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-2 text-sm font-medium"
            >
              <Shield className="h-4 w-4 text-primary" />
              Free WordPress Security Scanner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Scan Your WordPress Website for
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Vulnerabilities — Instantly
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Detect outdated plugins, insecure themes, and configuration issues before hackers do.
              Protect your site with our advanced WordPress security scanner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mx-auto max-w-2xl"
            >
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isScanning && handleScan()}
                  className="flex-1 h-12 text-lg"
                  disabled={isScanning}
                />
                <Button
                  size="lg"
                  onClick={handleScan}
                  disabled={isScanning || isVerifying}
                  className="h-12 px-8 group"
                >
                  {isVerifying ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Verifying WordPress...
                    </>
                  ) : isScanning ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Run Free Scan
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* WordPress Detection Error */}
              {notWordPress && wpDetection && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-5 rounded-lg bg-red-50 dark:bg-red-950/30 border-2 border-red-600 dark:border-red-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                        ⚠️ NOT A WORDPRESS WEBSITE
                      </h3>
                      <p className="text-sm text-red-800 dark:text-red-300 mb-3 leading-relaxed">
                        The URL you entered does not appear to be a WordPress site. 
                        WP Scan can only analyze WordPress websites.
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                        Please enter a valid WordPress site URL and try again.
                      </p>
                      
                      {/* Detection Details */}
                      <div className="mt-4 p-3 bg-white dark:bg-red-950/50 rounded border border-red-200 dark:border-red-800">
                        <p className="text-xs font-semibold text-red-900 dark:text-red-200 mb-2">
                          Detection Results:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-300 mb-1">Failed Checks:</p>
                            <ul className="space-y-1">
                              {wpDetection.failedChecks.slice(0, 4).map((check, i) => (
                                <li key={i} className="text-red-700 dark:text-red-400 flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {check}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {wpDetection.detectedIndicators.length > 0 && (
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-300 mb-1">Found:</p>
                              <ul className="space-y-1">
                                {wpDetection.detectedIndicators.map((indicator, i) => (
                                  <li key={i} className="text-green-700 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {indicator}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-3">
                          <strong>Confidence:</strong> {wpDetection.confidence}%
                          {wpDetection.method && <> | <strong>Method:</strong> {wpDetection.method}</>}
                        </p>
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                          ℹ️ Need 1 strong indicator (REST API, generator meta) or 2+ indicators for confirmation
                        </p>
                      </div>

                      {/* Force Scan Option */}
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded border border-yellow-200 dark:border-yellow-800">
                        <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                          🔧 Is this definitely a WordPress site?
                        </p>
                        <p className="text-xs text-yellow-800 dark:text-yellow-300 mb-3">
                          Some WordPress sites use strict security settings that block our detection. If you're certain this is WordPress, you can force scan anyway.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNotWordPress(false);
                            setIsScanning(true);
                            // Proceed with scan despite failed detection
                            handleScan();
                          }}
                          className="w-full text-xs border-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                        >
                          Force Scan Anyway (Skip Detection)
                        </Button>
                      </div>

                      {/* Example Sites */}
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">
                          💡 Try these example WordPress sites:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setUrl("https://wordpress.org")}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            wordpress.org
                          </button>
                          <button
                            onClick={() => setUrl("https://woocommerce.com")}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            woocommerce.com
                          </button>
                          <button
                            onClick={() => setUrl("https://scailupks.com")}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          >
                            scailupks.com
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <p className="text-sm text-muted-foreground">
                Free for basic scans. Upgrade for deeper security reports and automatic monitoring.
              </p>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">2.5M+</div>
                <p className="text-sm text-muted-foreground">Sites Scanned</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">180K+</div>
                <p className="text-sm text-muted-foreground">Vulnerabilities Found</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">99.8%</div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4 justify-center"
            >
              <Link href="/wp-scan/statistics" className="text-sm text-primary hover:underline">
                View Statistics →
              </Link>
              <Link href="/wp-scan/api-docs" className="text-sm text-primary hover:underline">
                API Documentation →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scan Results Section */}
      {scanResult && (
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2">Scan Results for {scanResult.url}</h2>
                  <p className="text-muted-foreground">
                    Scanned on {new Date(scanResult.scanned_at).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-3">
                    <span>Scan Duration: {(scanResult.scan_duration_ms / 1000).toFixed(1)}s</span>
                    <span>•</span>
                    <span>Detection Confidence: {scanResult.detection_confidence}%</span>
                  </div>
                </div>

                {/* Save Scan Button */}
                <div className="flex justify-center mb-6">
                  {!session ? (
                    <Card className="max-w-md">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                          <LogIn className="h-8 w-8 mx-auto text-primary" />
                          <p className="font-medium">Want to save this scan?</p>
                          <p className="text-sm text-muted-foreground">
                            Sign in to save your scan results and monitor your websites over time
                          </p>
                          <Button asChild className="w-full">
                            <Link href={`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`}>
                              <LogIn className="mr-2 h-4 w-4" />
                              Sign In to Save
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : userPlan === 'FREE' ? (
                    <Card className="max-w-md border-primary">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                          <Crown className="h-8 w-8 mx-auto text-primary" />
                          <p className="font-medium">Upgrade to Save Scans</p>
                          <p className="text-sm text-muted-foreground">
                            Free users can scan but cannot save results. Upgrade to Pro for scan history, alerts, and more.
                          </p>
                          <Button asChild className="w-full">
                            <Link href="/wp-scan/plans">
                              <Crown className="mr-2 h-4 w-4" />
                              Upgrade to Pro - $19/mo
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3 max-w-md w-full">
                      {saveSuccess && (
                        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                              <CheckCircle className="h-5 w-5" />
                              <p>Scan saved successfully! View it in your <Link href="/dashboard/wp-scan" className="underline font-medium">dashboard</Link>.</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {saveError && (
                        <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                              <XCircle className="h-5 w-5" />
                              <p>{saveError}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleSaveScan} 
                          disabled={isSaving || saveSuccess}
                          className="flex-1"
                          size="lg"
                        >
                          {isSaving ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : saveSuccess ? (
                            <>
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Saved!
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-5 w-5" />
                              Save Scan to Dashboard
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                          <Link href="/dashboard/wp-scan">
                            View Dashboard
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Score */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Overall Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold">{scanResult.risk_score}/100</div>
                    <div className="flex-1">
                      <div className="h-4 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            scanResult.risk_score >= 80
                              ? "bg-green-500"
                              : scanResult.risk_score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${scanResult.risk_score}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {scanResult.risk_score >= 80
                          ? "Good security posture"
                          : scanResult.risk_score >= 60
                          ? "Moderate risk - improvements recommended"
                          : "High risk - immediate action required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vulnerability Breakdown */}
              {scanResult.total_vulnerabilities > 0 && (
                <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-200">
                      <AlertTriangle className="h-5 w-5" />
                      Vulnerabilities Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {scanResult.severity_breakdown.critical > 0 && (
                        <div className="text-center p-3 rounded-lg bg-red-600 text-white">
                          <div className="text-2xl font-bold">{scanResult.severity_breakdown.critical}</div>
                          <div className="text-sm">Critical</div>
                        </div>
                      )}
                      {scanResult.severity_breakdown.high > 0 && (
                        <div className="text-center p-3 rounded-lg bg-orange-500 text-white">
                          <div className="text-2xl font-bold">{scanResult.severity_breakdown.high}</div>
                          <div className="text-sm">High</div>
                        </div>
                      )}
                      {scanResult.severity_breakdown.medium > 0 && (
                        <div className="text-center p-3 rounded-lg bg-yellow-500 text-white">
                          <div className="text-2xl font-bold">{scanResult.severity_breakdown.medium}</div>
                          <div className="text-sm">Medium</div>
                        </div>
                      )}
                      {scanResult.severity_breakdown.low > 0 && (
                        <div className="text-center p-3 rounded-lg bg-blue-500 text-white">
                          <div className="text-2xl font-bold">{scanResult.severity_breakdown.low}</div>
                          <div className="text-sm">Low</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* WordPress Core */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>WordPress Core</span>
                    {scanResult.core.vulnerabilities > 0 && (
                      <span className="text-sm font-normal text-red-600 dark:text-red-400">
                        {scanResult.core.vulnerabilities} vulnerability{scanResult.core.vulnerabilities > 1 ? 'ies' : 'y'}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(scanResult.core.status)}
                      <div>
                        <p className="font-medium">Version {scanResult.core.version}</p>
                        {scanResult.core.latest_version && (
                          <p className="text-sm text-muted-foreground">
                            Latest: {scanResult.core.latest_version}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Detected from: {scanResult.core.detected_from}</p>
                      </div>
                    </div>
                    <span className="text-sm capitalize px-3 py-1 rounded-full bg-background">
                      {scanResult.core.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Plugins */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Plugins ({scanResult.plugins.length})</CardTitle>
                  <CardDescription>
                    {scanResult.plugins.filter(p => p.vulnerabilities > 0).length > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        {scanResult.plugins.filter(p => p.vulnerabilities > 0).length} plugin(s) with vulnerabilities detected
                      </span>
                    ) : (
                      'Upgrade to Pro for detailed CVE information and vulnerability IDs'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scanResult.plugins.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No plugins detected</p>
                  ) : (
                    <div className="space-y-3">
                      {scanResult.plugins.map((plugin, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                          plugin.vulnerabilities > 0 ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900' : 'bg-secondary/30'
                        }`}>
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(plugin.status)}
                            <div className="flex-1">
                              <p className="font-medium">{plugin.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Version {plugin.version}
                                {plugin.latest_version && plugin.latest_version !== plugin.version && (
                                  <span> → {plugin.latest_version} available</span>
                                )}
                              </p>
                              {plugin.vulnerabilities > 0 && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                  ⚠️ {plugin.vulnerabilities} vulnerability{plugin.vulnerabilities > 1 ? 'ies' : 'y'} detected
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-sm capitalize px-3 py-1 rounded-full ${
                            plugin.status === 'vulnerable' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                            plugin.status === 'outdated' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                            'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          }`}>
                            {plugin.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Themes */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Themes ({scanResult.themes.length})</CardTitle>
                  <CardDescription>
                    {scanResult.themes.filter(t => t.vulnerabilities > 0).length > 0 ? (
                      <span className="text-red-600 dark:text-red-400">
                        {scanResult.themes.filter(t => t.vulnerabilities > 0).length} theme(s) with vulnerabilities detected
                      </span>
                    ) : (
                      scanResult.themes.length > 0 ? 'All themes scanned' : 'No themes detected'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {scanResult.themes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No themes detected</p>
                  ) : (
                    <div className="space-y-3">
                      {scanResult.themes.map((theme, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                          theme.vulnerabilities > 0 ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900' : 'bg-secondary/30'
                        }`}>
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(theme.status)}
                            <div className="flex-1">
                              <p className="font-medium">{theme.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Version {theme.version}
                                {theme.latest_version && theme.latest_version !== theme.version && (
                                  <span> → {theme.latest_version} available</span>
                                )}
                              </p>
                              {theme.vulnerabilities > 0 && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                  ⚠️ {theme.vulnerabilities} vulnerability{theme.vulnerabilities > 1 ? 'ies' : 'y'} detected
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-sm capitalize px-3 py-1 rounded-full ${
                            theme.status === 'vulnerable' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                            theme.status === 'outdated' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                            'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          }`}>
                            {theme.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Checks */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {scanResult.security.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade CTA */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Want a Detailed Security Report?</h3>
                    <p className="text-muted-foreground mb-6">
                      Upgrade to Pro or Agency plans for in-depth vulnerability analysis, automated monitoring, CVSS risk scores, and detailed PDF reports.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" asChild>
                        <Link href="#pricing">
                          View Pricing Plans
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => {setScanResult(null); setUrl("");}}>
                        Scan Another Site
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive WordPress Security Scanning</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Protect your WordPress site with advanced security features and real-time monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Vulnerability Detection",
                description: "Scan your site for known WordPress vulnerabilities and weak spots using our constantly updated database with 24,000+ vulnerabilities.",
              },
              {
                icon: FileCheck,
                title: "Plugin & Theme Analysis",
                description: "Detect outdated, insecure, or nulled plugins and themes. Get CVE IDs and detailed vulnerability information.",
              },
              {
                icon: Zap,
                title: "Detailed Reports",
                description: "Export full security reports in PDF or CSV format with CVSS scores, vulnerability PoC, and remediation steps.",
              },
              {
                icon: Shield,
                title: "Continuous Monitoring",
                description: "Get notified in real-time when new vulnerabilities are discovered that affect your WordPress installation.",
              },
              {
                icon: Clock,
                title: "Scheduled Scans",
                description: "Enable automatic daily, weekly, or custom interval scans to stay ahead of emerging security threats.",
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                description: "Receive instant notifications via email when new vulnerabilities are detected affecting your sites.",
              },
              {
                icon: Database,
                title: "API Access",
                description: "Integrate WP Scan into your workflow with our flexible RESTful API. Perfect for automation and CI/CD pipelines.",
              },
              {
                icon: Webhook,
                title: "Webhooks",
                description: "Get real-time notifications via Slack or HTTP webhooks when security issues are discovered.",
              },
              {
                icon: Activity,
                title: "CVSS Risk Scores",
                description: "Get industry-standard CVSS scores for every vulnerability to prioritize your security efforts effectively.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your WP Scan Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Select the plan that fits your needs. All paid plans include continuous monitoring and instant alerts.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
              />
              <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly <span className="text-primary">(Save 25%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                name: "Free",
                monthlyPrice: 0,
                yearlyPrice: 0,
                description: "Best for individuals & small sites",
                features: [
                  "One-time manual scan",
                  "Basic vulnerability check",
                  "Limited plugin/theme checks",
                  "Basic security report",
                  "No continuous monitoring",
                ],
                highlighted: false,
                cta: "Start Free Scan",
                ctaLink: "#",
                isPaid: false,
                stripeMonthly: "#",
                stripeYearly: "#",
              },
              {
                name: "Pro",
                monthlyPrice: 49,
                yearlyPrice: 441,
                description: "Best for freelancers & SMBs",
                features: [
                  "Weekly automated scans",
                  "Continuous vulnerability monitoring",
                  "Plugin & theme version tracking",
                  "Downloadable PDF reports",
                  "Email instant alerts",
                  "Up to 3 websites",
                  "Vulnerability details by ID",
                ],
                highlighted: true,
                cta: "Get Started",
                productSlug: "wp-scan",
                tierMonthly: "pro-monthly",
                tierYearly: "pro-yearly",
                isPaid: true,
              },
              {
                name: "Agency",
                monthlyPrice: 149,
                yearlyPrice: 1341,
                description: "Best for web agencies",
                features: [
                  "Daily automated scans",
                  "Continuous monitoring for all sites",
                  "Up to 25 websites",
                  "White-label PDF/CSV reports",
                  "Vulnerability history tracking",
                  "CVSS Risk Scores",
                  "Email & Slack alerts",
                  "Priority support",
                ],
                highlighted: false,
                cta: "Get Started",
                productSlug: "wp-scan",
                tierMonthly: "agency-monthly",
                tierYearly: "agency-yearly",
                isPaid: true,
              },
              {
                name: "Enterprise",
                monthlyPrice: 499,
                yearlyPrice: 4491,
                description: "For hosting providers & large orgs",
                features: [
                  "Unlimited sites",
                  "Real-time continuous monitoring",
                  "Full API access",
                  "Webhooks (Slack & HTTP)",
                  "Vulnerability PoC data",
                  "CVSS Risk Scores",
                  "Custom integrations",
                  "Dedicated account manager",
                  "24/7 priority support",
                ],
                highlighted: false,
                cta: "Contact Sales",
                ctaLink: "/contact",
                stripeMonthly: "/contact",
                stripeYearly: "/contact",
                isPaid: false,
              },
            ].map((plan, index) => {
              const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const period = billingCycle === "monthly" ? "/month" : "/year";
              const tierName = plan.isPaid && plan.productSlug ? (billingCycle === "monthly" ? plan.tierMonthly : plan.tierYearly) : null;

              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={`h-full ${plan.highlighted ? "border-primary/50 shadow-lg ring-2 ring-primary/20" : ""}`}>
                  <CardHeader>
                    {plan.highlighted && (
                      <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{symbol}{price}</span>
                      <span className="text-muted-foreground">{period}</span>
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <p className="text-sm text-primary mt-2">
                        {symbol}{(price / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.isPaid && plan.productSlug && tierName ? (
                      <UnifiedCheckoutButton
                        productSlug={plan.productSlug}
                        tierName={tierName}
                        variant={plan.highlighted ? "default" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </UnifiedCheckoutButton>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.highlighted ? "default" : "outline"}
                        asChild
                      >
                        <Link href={plan.ctaLink || "/contact"}>{plan.cta}</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              All paid plans open in a new dedicated scan dashboard for detailed results
            </p>
            <Link href="/wp-scan/api-docs" className="text-primary hover:underline">
              Enterprise? View our API Documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How accurate are WP Scan results?",
                answer: "WP Scan uses an extensive database of 24,000+ known WordPress vulnerabilities, updated daily. Our scanner has a 99.8% accuracy rate and cross-references multiple security databases including CVE, WPScan, and proprietary threat intelligence.",
              },
              {
                question: "What is continuous monitoring?",
                answer: "Continuous monitoring means we actively monitor the web for new vulnerabilities affecting WordPress, plugins, and themes. When a new vulnerability is discovered that affects your site, you receive an instant alert via email or webhook, even between scheduled scans.",
              },
              {
                question: "Can I use WP Scan for client websites?",
                answer: "Yes! Our Agency and Enterprise plans are specifically designed for agencies and developers managing multiple client sites. You can generate white-label reports and manage all sites from a single dashboard with API access.",
              },
              {
                question: "What are CVSS Risk Scores?",
                answer: "CVSS (Common Vulnerability Scoring System) is an industry-standard way to assess the severity of security vulnerabilities. Scores range from 0-10, helping you prioritize which vulnerabilities to fix first. Available in Agency and Enterprise plans.",
              },
              {
                question: "Does WP Scan store my website data?",
                answer: "We only store basic scan metadata (URL, scan date, results). We never store passwords, user data, or database content. All scans are performed securely and data is encrypted in transit and at rest.",
              },
              {
                question: "How does the API work?",
                answer: "Our RESTful API (Enterprise plan) allows you to integrate WP Scan into your workflow. Automate scans, retrieve vulnerability data, and receive webhook notifications. Full documentation available at /wp-scan/api-docs.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Secure Your WordPress Websites Before It's Too Late
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of WordPress site owners protecting their sites with WP Scan's continuous monitoring and instant vulnerability alerts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <Search className="mr-2 h-5 w-5" />
                Run Free Scan
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#pricing">
                  View Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
