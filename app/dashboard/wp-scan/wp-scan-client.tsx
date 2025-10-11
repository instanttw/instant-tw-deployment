"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, AlertTriangle, CheckCircle2, Clock, Eye, Trash2,
  TrendingUp, Activity, Globe, ArrowRight, Plus, RefreshCw,
  AlertCircle, XCircle, FileText, Download, Zap
} from "lucide-react";
import { format } from "date-fns";

interface Scan {
  id: string;
  website_id: string;
  website_url: string;
  website_name: string;
  scanned_at: string;
  risk_score: number;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  detection_confidence: number;
  status: string;
}

interface Website {
  id: string;
  url: string;
  name: string;
  last_scanned_at: string | null;
  is_active: boolean;
  latest_risk_score?: number;
  latest_vulnerabilities?: number;
}

export default function WPScanDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({
    totalWebsites: 0,
    totalScans: 0,
    avgRiskScore: 0,
    activeWebsites: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const userPlan = session?.user?.plan || 'FREE';

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/wp-scan");
    } else if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/wpscan/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setWebsites(data.websites || []);
      setRecentScans(data.recentScans || []);
      setStats(data.stats || {
        totalWebsites: 0,
        totalScans: 0,
        avgRiskScore: 0,
        activeWebsites: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-orange-600";
    return "text-green-600";
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">High Risk</Badge>;
    if (score >= 40) return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium Risk</Badge>;
    return <Badge variant="default" className="bg-green-100 text-green-800">Low Risk</Badge>;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your security dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Free plan upgrade prompt
  if (userPlan === 'FREE') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">WP Scan Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Monitor and secure your WordPress websites
          </p>
        </div>

        <Card className="border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Upgrade to Save Scan Results</CardTitle>
            <CardDescription className="text-base">
              Free users can scan WordPress websites but cannot save results. Upgrade to Pro to unlock:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Save Scan History</p>
                  <p className="text-sm text-muted-foreground">Access all your past scans anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Monitor 3 Websites</p>
                  <p className="text-sm text-muted-foreground">Track multiple WordPress sites</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Weekly Automated Scans</p>
                  <p className="text-sm text-muted-foreground">Get notified of new vulnerabilities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Full CVE Details</p>
                  <p className="text-sm text-muted-foreground">See detailed vulnerability information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">PDF Reports</p>
                  <p className="text-sm text-muted-foreground">Export professional reports</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified of security issues</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" asChild className="gap-2">
                <Link href="/wp-scan/plans">
                  <Zap className="h-5 w-5" />
                  Upgrade to Pro - $19/mo
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/wp-scan">
                  Continue with Free Scanning
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">WP Scan Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Monitor and secure your WordPress websites
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/wp-scan">
              <Plus className="mr-2 h-4 w-4" />
              New Scan
            </Link>
          </Button>
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebsites}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeWebsites} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(stats.avgRiskScore)}`}>
              {stats.avgRiskScore}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lower is better
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Plan</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPlan}</div>
            <Button variant="link" className="h-auto p-0 text-xs" asChild>
              <Link href="/wp-scan/plans">
                Upgrade Plan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monitored Websites */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monitored Websites</CardTitle>
          <CardDescription>
            Your WordPress websites and their security status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {websites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No websites yet</p>
              <p className="text-muted-foreground mb-4">
                Scan your first WordPress website to get started
              </p>
              <Button asChild>
                <Link href="/wp-scan">
                  <Plus className="mr-2 h-4 w-4" />
                  Scan Website
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <div key={website.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{website.name}</h3>
                        <Badge variant={website.is_active ? "default" : "secondary"}>
                          {website.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{website.url}</p>
                      {website.last_scanned_at && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Last scan: {format(new Date(website.last_scanned_at), 'PPp')}
                          </div>
                          {website.latest_risk_score !== undefined && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              Risk: <span className={getRiskColor(website.latest_risk_score)}>
                                {website.latest_risk_score}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/wp-scan/website/${website.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/wp-scan?url=${encodeURIComponent(website.url)}`}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Scan
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>
            Your latest security scans and findings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No scans yet</p>
              <p className="text-muted-foreground">
                Your scan history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{scan.website_name}</h3>
                        {getRiskBadge(scan.risk_score)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Risk Score</p>
                          <p className={`font-semibold ${getRiskColor(scan.risk_score)}`}>
                            {scan.risk_score}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vulnerabilities</p>
                          <p className="font-semibold">{scan.total_vulnerabilities}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Critical</p>
                          <p className="font-semibold text-red-600">{scan.critical_count}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Scanned</p>
                          <p className="font-semibold">{format(new Date(scan.scanned_at), 'PPp')}</p>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/wp-scan/scan/${scan.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
