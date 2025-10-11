"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Simulate verification delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Invalid Session</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              No payment session found. Please try again.
            </p>
            <Button asChild>
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase. Your subscription is now active.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
            <CardDescription>Follow these steps to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Check Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent your license key and download links to your email address.
                  Please check your inbox (and spam folder).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Access Your Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Visit your customer dashboard to download plugins, view license keys,
                  and manage your subscriptions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Download & Install</h3>
                <p className="text-sm text-muted-foreground">
                  Download the plugin files from your dashboard and follow our installation
                  guide to activate them on your WordPress site.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Get Support</h3>
                <p className="text-sm text-muted-foreground">
                  Need help? Our support team is ready to assist you. Access our knowledge
                  base or contact us directly at{" "}
                  <a href="mailto:wp@instant.tw" className="text-primary hover:underline">
                    wp@instant.tw
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Download className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">
              View Documentation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono">{sessionId}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this ID for your records. You can use it for support inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
