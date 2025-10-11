"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-3xl">Checkout Cancelled</CardTitle>
          <p className="text-lg text-muted-foreground mt-2">
            Your subscription was not completed
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/30 rounded-lg p-6">
            <p className="text-center text-muted-foreground">
              No charges have been made to your account. You can return to the pricing page to choose a plan anytime.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <div className="flex gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900 dark:text-blue-200 mb-1">
                  Had trouble with checkout?
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  If you experienced any issues, please <Link href="/contact" className="underline">contact our support team</Link>. We're here to help!
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild size="lg">
              <Link href="/wp-scan/plans">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Pricing
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/wp-scan">
                Try Free Scanner
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              You can continue using WP Scan for free with unlimited scans
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
