"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  Users,
  ShoppingCart,
  RefreshCw,
  Download,
} from "lucide-react";

interface RevenueStats {
  total_revenue: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  refunded_orders: number;
  average_order_value: number;
}

interface TopProduct {
  product_id: string;
  product_name: string;
  product_slug: string;
  order_count: number;
  total_quantity: number;
  total_revenue: number;
}

export default function AdminRevenuePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<number>(30);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/revenue");
      return;
    }

    if (status === "authenticated") {
      loadRevenueData();
    }
  }, [status, router, timeRange]);

  async function loadRevenueData() {
    try {
      setLoading(true);

      // Fetch stats and top products
      const [statsRes, productsRes] = await Promise.all([
        fetch(`/api/admin/stats?days=${timeRange}`),
        fetch("/api/admin/products/top"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setTopProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error loading revenue data:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  }

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

  const completionRate = stats
    ? ((stats.completed_orders / stats.total_orders) * 100).toFixed(1)
    : "0";

  return (
    <SidebarLayout type="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Revenue & Analytics</h1>
            <p className="text-muted-foreground">
              Track sales performance and revenue trends
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadRevenueData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={timeRange === 7 ? "default" : "outline"}
                onClick={() => setTimeRange(7)}
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Last 7 Days
              </Button>
              <Button
                variant={timeRange === 30 ? "default" : "outline"}
                onClick={() => setTimeRange(30)}
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
              </Button>
              <Button
                variant={timeRange === 90 ? "default" : "outline"}
                onClick={() => setTimeRange(90)}
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Last 90 Days
              </Button>
              <Button
                variant={timeRange === 365 ? "default" : "outline"}
                onClick={() => setTimeRange(365)}
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Last Year
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? formatCurrency(stats.total_revenue) : "$0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last {timeRange} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.completed_orders || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? formatCurrency(Math.round(stats.average_order_value)) : "$0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Order completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Completed Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats?.completed_orders || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats?.pending_orders || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Refunded Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats?.refunded_orders || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>
              Top performing products in the last {timeRange} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No sales data yet</p>
                <p className="text-muted-foreground">
                  Sales data will appear here once orders are completed
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.order_count} orders • {product.total_quantity} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatCurrency(product.total_revenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
