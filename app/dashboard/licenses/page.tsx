"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import { Key, Download, Package, Copy, Check, Globe, Calendar, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface License {
  id: string;
  license_key: string;
  product_id: string;
  status: string;
  tier_name?: string;
  site_limit?: number;
  sites_used: number;
  activated_domains: string[];
  expires_at?: string;
  created_at: string;
}

export default function LicensesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard/licenses");
    } else if (status === "authenticated") {
      loadLicenses();
    }
  }, [status, router]);

  async function loadLicenses() {
    try {
      setLoading(true);
      const response = await fetch("/api/user/licenses");
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error("Error loading licenses:", error);
    } finally {
      setLoading(false);
    }
  }

  function copyLicenseKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  if (status === "loading" || loading) {
    return (
      <SidebarLayout type="user">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!session) return null;

  const activeLicenses = licenses.filter((l) => l.status === "active").length;

  return (
    <SidebarLayout type="user">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">License Keys</h1>
          <p className="text-muted-foreground">
            Manage your plugin licenses and downloads
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Licenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{licenses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeLicenses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Activations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {licenses.reduce((sum, l) => sum + l.sites_used, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Licenses</CardTitle>
            <CardDescription>Active license keys for your plugins and services</CardDescription>
          </CardHeader>
          <CardContent>
            {licenses.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No licenses yet</p>
                <p className="text-muted-foreground mb-4">
                  Purchase a plan to get access to premium plugins and their license keys
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link href="/pricing">View Plans</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/plugins">Browse Plugins</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <Card key={license.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {/* License Key */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {license.status === "active" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <code className="font-mono font-semibold text-sm bg-muted px-2 py-1 rounded">
                            {license.license_key}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLicenseKey(license.license_key)}
                            className="h-6 px-2"
                          >
                            {copiedKey === license.license_key ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Badge variant={license.status === "active" ? "default" : "secondary"}>
                            {license.status}
                          </Badge>
                          {license.tier_name && (
                            <Badge variant="outline">{license.tier_name}</Badge>
                          )}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Site Limit:</span>{" "}
                            <span className="font-medium">
                              {license.site_limit || "Unlimited"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sites Used:</span>{" "}
                            <span className="font-medium">{license.sites_used}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>{" "}
                            <span className="font-medium">
                              {new Date(license.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Activated Domains */}
                        {license.activated_domains && license.activated_domains.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <span className="text-muted-foreground">Activated on:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {license.activated_domains.map((domain, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-muted px-2 py-1 rounded"
                                  >
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expires */}
                        {license.expires_at && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Expires: {new Date(license.expires_at).toLocaleString()}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-3 w-3" />
                            Download Plugin
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
