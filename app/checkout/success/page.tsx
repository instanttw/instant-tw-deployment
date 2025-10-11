"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Force dynamic rendering - required for useSearchParams() and Stripe callbacks
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setIsVerifying(false);
      return;
    }

    // Give webhook a moment to process (Stripe webhooks are usually instant)
    const timer = setTimeout(async () => {
      // Refresh the session to get updated plan
      await update();
      setIsVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId, update]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing your subscription...</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button asChild className="mt-4">
              <Link href="/wp-scan/plans">Back to Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl">Welcome to WP Scan {session?.user?.plan || 'Pro'}!</CardTitle>
          <p className="text-lg text-muted-foreground mt-2">
            Your subscription is now active
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/30 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg">What's Next?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Scan your WordPress websites</p>
                  <p className="text-sm text-muted-foreground">Run security scans and save results to your dashboard</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Add websites to monitor</p>
                  <p className="text-sm text-muted-foreground">Set up automatic scanning based on your plan</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">View vulnerability details</p>
                  <p className="text-sm text-muted-foreground">Access full CVE details and CVSS scores</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Export reports</p>
                  <p className="text-sm text-muted-foreground">Download PDF reports of your security scans</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Receipt sent!</strong> A confirmation email has been sent to {session?.user?.email}. You can manage your subscription anytime from your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild size="lg" className="flex-1">
              <Link href="/wp-scan">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Scanning
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href="/dashboard/wp-scan">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Need help? <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
