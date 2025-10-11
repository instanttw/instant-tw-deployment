"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import {
  Search,
  Key,
  Copy,
  Check,
  Ban,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  RefreshCw,
} from "lucide-react";

interface License {
  id: string;
  license_key: string;
  user_id: string;
  product_id: string;
  status: string;
  tier_name?: string;
  site_limit?: number;
  sites_used: number;
  activated_domains: string[];
  expires_at?: string;
  created_at: string;
  order_id: string;
}

export default function AdminLicensesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/licenses");
      return;
    }

    if (status === "authenticated") {
      loadLicenses();
    }
  }, [status, router]);

  async function loadLicenses() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/licenses/list");
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

  function getStatusIcon(status: string) {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "expired":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "revoked":
        return <Ban className="h-4 w-4 text-red-500" />;
      case "suspended":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Key className="h-4 w-4 text-gray-500" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "revoked":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  const filteredLicenses = licenses.filter((license) => {
    const matchesSearch =
      searchTerm === "" ||
      license.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.user_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || license.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: licenses.length,
    active: licenses.filter((l) => l.status === "active").length,
    expired: licenses.filter((l) => l.status === "expired").length,
    revoked: licenses.filter((l) => l.status === "revoked").length,
  };

  if (status === "loading" || loading) {
    return (
      <SidebarLayout type="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!session) return null;

  return (
    <SidebarLayout type="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">License Keys</h1>
            <p className="text-muted-foreground">
              Manage license keys and activations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadLicenses}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <Key className="mr-2 h-4 w-4" />
              Generate License
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Licenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.expired}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revoked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.revoked}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by license key or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  onClick={() => setStatusFilter("active")}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "expired" ? "default" : "outline"}
                  onClick={() => setStatusFilter("expired")}
                  size="sm"
                >
                  Expired
                </Button>
                <Button
                  variant={statusFilter === "revoked" ? "default" : "outline"}
                  onClick={() => setStatusFilter("revoked")}
                  size="sm"
                >
                  Revoked
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Licenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Licenses</CardTitle>
            <CardDescription>
              {filteredLicenses.length} license{filteredLicenses.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLicenses.length === 0 ? (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No licenses found</p>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Licenses will appear here when orders are completed"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLicenses.map((license) => (
                  <Card key={license.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* License Key */}
                          <div className="flex items-center gap-2">
                            {getStatusIcon(license.status)}
                            <code className="text-sm font-mono font-semibold bg-muted px-2 py-1 rounded">
                              {license.license_key}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyLicenseKey(license.license_key)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedKey === license.license_key ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Badge
                              variant="outline"
                              className={getStatusColor(license.status)}
                            >
                              {license.status}
                            </Badge>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Tier:</span>{" "}
                              {license.tier_name || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Site Limit:</span>{" "}
                              {license.site_limit || "Unlimited"}
                            </div>
                            <div>
                              <span className="font-medium">Sites Used:</span>{" "}
                              {license.sites_used}
                            </div>
                          </div>

                          {/* Activated Domains */}
                          {license.activated_domains && license.activated_domains.length > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                              <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div className="flex-1">
                                <span className="font-medium text-muted-foreground">
                                  Activated on:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {license.activated_domains.map((domain, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs bg-muted px-2 py-1 rounded inline-block mr-2"
                                    >
                                      {domain}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Dates */}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Created:</span>{" "}
                              {new Date(license.created_at).toLocaleDateString()}
                            </div>
                            {license.expires_at && (
                              <div>
                                <span className="font-medium">Expires:</span>{" "}
                                {new Date(license.expires_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {license.status === "active" && (
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Ban className="h-3 w-3 mr-1" />
                              Revoke
                            </Button>
                          )}
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
