"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle2, XCircle,
  Globe, Clock, TrendingUp, Package, Palette, Code, ExternalLink,
  FileDown, RefreshCw, AlertCircle, Info
} from "lucide-react";
import { format } from "date-fns";

interface ScanDetail {
  id: string;
  website_id: string;
  website_url: string;
  website_name: string;
  scanned_at: string;
  scan_duration_ms: number;
  risk_score: number;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  detection_confidence: number;
  core_data: any;
  plugins_data: any[];
  themes_data: any[];
  security_data: string[];
  status: string;
}

interface Finding {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  cve_id: string | null;
  cvss_score: number | null;
  component_type: string;
  component_slug: string;
  component_name: string;
  affected_version: string;
  fixed_in: string | null;
  status: string;
}

export default function ScanDetailClient({ scanId }: { scanId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scan, setScan] = useState<ScanDetail | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/wp-scan");
    } else if (status === "authenticated") {
      fetchScanDetail();
    }
  }, [status, scanId, router]);

  const fetchScanDetail = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/wpscan/scan/${scanId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch scan details');
      }

      const data = await response.json();
      setScan(data.scan);
      setFindings(data.findings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scan details');
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

  const getSeverityBadge = (severity: string) => {
    const severityLower = severity.toLowerCase();
    if (severityLower === 'critical') return <Badge variant="destructive">Critical</Badge>;
    if (severityLower === 'high') return <Badge variant="destructive" className="bg-red-100 text-red-800">High</Badge>;
    if (severityLower === 'medium') return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium</Badge>;
    return <Badge variant="secondary">Low</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'secure') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (status === 'outdated') return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const response = await fetch(`/api/wpscan/export/${scanId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export PDF');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `wp-scan-report-${scanId}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading scan details...</p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-lg font-medium">{error || 'Scan not found'}</p>
              <Button asChild>
                <Link href="/dashboard/wp-scan">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
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
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/wp-scan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{scan.website_name}</h1>
            <p className="text-lg text-muted-foreground">{scan.website_url}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(scan.scanned_at), 'PPp')}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {(scan.scan_duration_ms / 1000).toFixed(1)}s scan time
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? 'Generating PDF...' : 'Export PDF'}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/wp-scan?url=${encodeURIComponent(scan.website_url)}`}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Rescan
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Risk Score Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getRiskColor(scan.risk_score)}`}>
                {scan.risk_score}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Risk Score</p>
              <div className="mt-2">{getRiskBadge(scan.risk_score)}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{scan.total_vulnerabilities}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Issues</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600">{scan.critical_count}</div>
              <p className="text-sm text-muted-foreground mt-1">Critical</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">{scan.high_count}</div>
              <p className="text-sm text-muted-foreground mt-1">High</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600">{scan.medium_count}</div>
              <p className="text-sm text-muted-foreground mt-1">Medium</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WordPress Core */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            WordPress Core
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Version {scan.core_data.version}</p>
              {scan.core_data.latest_version && (
                <p className="text-sm text-muted-foreground">
                  Latest: {scan.core_data.latest_version}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(scan.core_data.status)}
              <Badge variant={scan.core_data.status === 'secure' ? 'default' : 'destructive'}>
                {scan.core_data.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plugins */}
      {scan.plugins_data && scan.plugins_data.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Plugins ({scan.plugins_data.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scan.plugins_data.map((plugin, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{plugin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Version: {plugin.version}
                      {plugin.latest_version && ` → ${plugin.latest_version} available`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(plugin.status)}
                    <Badge variant={plugin.status === 'secure' ? 'default' : 'destructive'}>
                      {plugin.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Themes */}
      {scan.themes_data && scan.themes_data.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Themes ({scan.themes_data.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scan.themes_data.map((theme, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{theme.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Version: {theme.version}
                      {theme.latest_version && ` → ${theme.latest_version} available`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(theme.status)}
                    <Badge variant={theme.status === 'secure' ? 'default' : 'destructive'}>
                      {theme.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Findings */}
      {findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vulnerabilities & Issues ({findings.length})</CardTitle>
            <CardDescription>Detailed security findings from the scan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {findings.map((finding) => (
                <Card key={finding.id} className="border-l-4 border-l-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{finding.title}</h4>
                          {getSeverityBadge(finding.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Component: <span className="font-medium">{finding.component_name}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Type: <span className="font-medium">{finding.component_type}</span>
                          </span>
                          {finding.cve_id && (
                            <span className="text-muted-foreground">
                              CVE: <span className="font-medium">{finding.cve_id}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {finding.fixed_in && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 rounded text-sm">
                        <Info className="h-4 w-4 inline mr-1" />
                        Fixed in version: <span className="font-semibold">{finding.fixed_in}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
