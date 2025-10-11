"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900 mb-6">
            <XCircle className="h-12 w-12 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-xl text-muted-foreground">
            Your payment was not processed. No charges were made to your account.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
            <CardDescription>
              You cancelled the checkout process or your payment was declined.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t worry - this happens sometimes! Here are some common reasons why
              payments might be cancelled or declined:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>You decided to review your options before purchasing</li>
              <li>Insufficient funds in your account</li>
              <li>Your bank flagged the transaction as suspicious</li>
              <li>Incorrect card details were entered</li>
              <li>Your card has expired or been blocked</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ready to try again?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you still want to purchase, you can return to our pricing page and try
              again. Make sure to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Double-check your card details</li>
              <li>Ensure you have sufficient funds</li>
              <li>Contact your bank if the payment is being blocked</li>
              <li>Try a different payment method</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild size="lg">
            <Link href="/pricing">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Pricing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
          </Button>
        </div>

        <div className="text-center p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you&apos;re experiencing issues with payment or have questions about our
            plans, we&apos;re here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
            <a
              href="mailto:wp@instant.tw"
              className="text-primary hover:underline"
            >
              wp@instant.tw
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="mailto:sales@instant.tw"
              className="text-primary hover:underline"
            >
              sales@instant.tw
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
