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
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Code,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  processed: boolean;
  processed_at?: string;
  processing_error?: string;
  retry_count: number;
  received_at: string;
  payload: any;
}

export default function AdminWebhooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin/webhooks");
      return;
    }

    if (status === "authenticated") {
      loadWebhooks();
    }
  }, [status, router]);

  async function loadWebhooks() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/webhooks/list");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error loading webhooks:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.event_id.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "processed") {
      matchesStatus = event.processed;
    } else if (statusFilter === "pending") {
      matchesStatus = !event.processed && !event.processing_error;
    } else if (statusFilter === "failed") {
      matchesStatus = !!event.processing_error;
    }

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: events.length,
    processed: events.filter((e) => e.processed).length,
    pending: events.filter((e) => !e.processed && !e.processing_error).length,
    failed: events.filter((e) => e.processing_error).length,
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
            <h1 className="text-3xl font-bold mb-2">Webhook Events</h1>
            <p className="text-muted-foreground">
              Monitor Stripe webhook events and processing status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadWebhooks}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.processed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
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
                    placeholder="Search by event type or ID..."
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
                  variant={statusFilter === "processed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("processed")}
                  size="sm"
                >
                  Processed
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "failed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("failed")}
                  size="sm"
                >
                  Failed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No webhook events found</p>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Webhook events will appear here"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          {/* Event Type & Status */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Code className="h-4 w-4 text-primary" />
                            <span className="font-mono font-semibold text-sm">
                              {event.event_type}
                            </span>
                            {event.processed && !event.processing_error && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Processed
                              </Badge>
                            )}
                            {!event.processed && !event.processing_error && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {event.processing_error && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </div>

                          {/* Event ID */}
                          <div className="text-xs text-muted-foreground font-mono">
                            ID: {event.event_id}
                          </div>

                          {/* Dates */}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Received: {new Date(event.received_at).toLocaleString()}
                            </div>
                            {event.processed_at && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Processed: {new Date(event.processed_at).toLocaleString()}
                              </div>
                            )}
                          </div>

                          {/* Error Message */}
                          {event.processing_error && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-red-900">
                                    Processing Error
                                  </p>
                                  <p className="text-xs text-red-700 mt-1">
                                    {event.processing_error}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Retry Count */}
                          {event.retry_count > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Retry attempts: {event.retry_count}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Payload
                          </Button>
                          {event.processing_error && (
                            <Button variant="outline" size="sm">
                              Retry
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
