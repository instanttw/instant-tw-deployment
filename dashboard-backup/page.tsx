"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Copy, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";

const mockPurchases = [
  {
    id: "1",
    pluginId: "1",
    pluginName: "Advanced SEO Toolkit",
    tier: "Pro",
    licenseKey: "PM-ABCD1234-EFGH5678-IJKL9012",
    activationLimit: 5,
    activations: 2,
    purchaseDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "active" as const,
  },
  {
    id: "2",
    pluginId: "3",
    pluginName: "Form Builder Pro",
    tier: "Agency",
    licenseKey: "PM-MNOP3456-QRST7890-UVWX1234",
    activationLimit: 0,
    activations: 15,
    purchaseDate: "2024-02-01",
    expiryDate: "2025-02-01",
    status: "active" as const,
  },
];

export default function DashboardPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "expired":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your licenses, downloads, and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockPurchases.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Activations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockPurchases.reduce((acc, p) => acc + p.activations, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Licenses</CardTitle>
            <CardDescription>
              Manage your plugin licenses and download the latest versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{purchase.pluginName}</h3>
                        <Badge>{purchase.tier}</Badge>
                        {getStatusIcon(purchase.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                        {" • "}
                        Expires {new Date(purchase.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">License Key</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyLicenseKey(purchase.licenseKey)}
                      >
                        {copiedKey === purchase.licenseKey ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <code className="text-sm font-mono">{purchase.licenseKey}</code>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Activations: </span>
                      <span className="font-medium">
                        {purchase.activations}
                        {purchase.activationLimit > 0 && ` / ${purchase.activationLimit}`}
                        {purchase.activationLimit === 0 && " / Unlimited"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Manage Sites
                      </Button>
                      <Button variant="outline" size="sm">
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="font-medium">john@example.com</p>
              </div>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Payment Method
                </label>
                <p className="font-medium">•••• •••• •••• 4242</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Next Billing Date
                </label>
                <p className="font-medium">January 15, 2025</p>
              </div>
              <Button variant="outline" className="w-full">
                Manage Billing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
