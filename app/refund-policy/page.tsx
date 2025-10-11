import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RefundPolicyPage() {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Our Commitment to You</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              At Instant (https://instant.tw/), we stand behind the quality of our WordPress plugins. 
              We want you to be completely satisfied with your purchase. That's why we offer a 
              <strong> 30-day money-back guarantee</strong> on all paid plans.
            </p>
            <p className="text-muted-foreground">
              This Refund Policy explains our refund procedures, eligibility criteria, and what you 
              need to know before requesting a refund.
            </p>
          </CardContent>
        </Card>

        {/* 30-Day Money-Back Guarantee */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">30-Day Money-Back Guarantee</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Eligibility</h3>
              <p className="text-muted-foreground mb-4">
                You are eligible for a full refund if you meet ALL of the following criteria:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You request a refund within <strong>30 days</strong> of your original purchase date</li>
                <li>This is your <strong>first purchase</strong> with us (first-time customers only)</li>
                <li>You have not violated our Terms of Service</li>
                <li>You provide a valid reason for the refund request</li>
                <li>You have made a genuine attempt to resolve any technical issues with our support team</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How to Request a Refund</h3>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Contact our billing team at <strong>billing@instant.tw</strong></li>
                <li>Include your order number and the email address used for purchase</li>
                <li>Provide a brief explanation of why you're requesting a refund</li>
                <li>Allow up to 5-7 business days for processing</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Processing Time</h3>
              <p className="text-muted-foreground">
                Once your refund request is approved, the refund will be processed within 5-7 business days. 
                The refund will be issued to the original payment method used for the purchase. Please note 
                that it may take an additional 5-10 business days for the refund to appear in your account, 
                depending on your bank or credit card company.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Happens After Refund */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">What Happens After a Refund</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">
                When your refund is processed:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Your subscription will be immediately cancelled</li>
                <li>Your account will be downgraded to the Free plan</li>
                <li>Access to premium features will be revoked</li>
                <li>You will need to uninstall the paid plugins from your website</li>
                <li>You will no longer receive updates or support for paid plugins</li>
                <li>Your license keys will be deactivated</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Important Note
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Make sure to export or backup any data or configurations from our plugins before 
                    requesting a refund, as you will lose access immediately upon refund approval.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Non-Refundable Items */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-500" />
              <CardTitle className="text-2xl">Non-Refundable Circumstances</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-4">
                We cannot issue refunds in the following situations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
                <li>
                  <strong>After 30 Days:</strong> Refund requests made more than 30 days after purchase
                </li>
                <li>
                  <strong>Renewals:</strong> Subscription renewals are non-refundable. Make sure to cancel 
                  before your renewal date if you don't wish to continue
                </li>
                <li>
                  <strong>Repeat Purchases:</strong> Second or subsequent purchases (our 30-day guarantee 
                  applies only to first-time customers)
                </li>
                <li>
                  <strong>Violation of Terms:</strong> If your account has been suspended or terminated 
                  due to violation of our Terms of Service
                </li>
                <li>
                  <strong>Partial Refunds:</strong> We do not offer partial refunds for unused time on 
                  monthly or annual subscriptions
                </li>
                <li>
                  <strong>Lack of Use:</strong> Simply not using the plugins is not grounds for a refund. 
                  We encourage you to try our free plan first
                </li>
                <li>
                  <strong>Change of Mind:</strong> General dissatisfaction without specific technical issues 
                  or support interaction
                </li>
                <li>
                  <strong>Third-Party Issues:</strong> Issues caused by third-party plugins, themes, or 
                  hosting providers that are outside our control
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Cancellation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Subscription Cancellation vs. Refund</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Cancelling Your Subscription</h3>
              <p className="text-muted-foreground mb-4">
                If you want to cancel your subscription but are not eligible for a refund (or don't want one), 
                you can cancel anytime from your account dashboard:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Log in to your account at https://instant.tw/</li>
                <li>Go to Account Settings → Subscriptions</li>
                <li>Click "Cancel Subscription"</li>
                <li>Your access will continue until the end of your current billing period</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Difference Between Cancellation and Refund</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>Cancellation:</strong> Stops future billing but you keep access until the end of 
                  your current period. No money is refunded.
                </li>
                <li>
                  <strong>Refund:</strong> Returns your money and immediately terminates your access to 
                  paid features.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Special Circumstances */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Special Circumstances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Issues</h3>
              <p className="text-muted-foreground">
                If you're experiencing technical issues with our plugins, we strongly encourage you to 
                contact our support team at <strong>wp@instant.tw</strong> before requesting a refund. 
                In most cases, our team can resolve technical issues within 24-48 hours. We want to 
                ensure you've had the opportunity to experience our plugins working properly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Duplicate Charges</h3>
              <p className="text-muted-foreground">
                If you were charged twice for the same purchase due to an error, please contact us 
                immediately at <strong>billing@instant.tw</strong>. We will issue a full refund for 
                the duplicate charge, regardless of the 30-day window.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Fraudulent Charges</h3>
              <p className="text-muted-foreground">
                If you notice a charge from Instant that you did not authorize, please contact us 
                immediately at <strong>security@instant.tw</strong>. We take fraud seriously and will 
                investigate and resolve the issue promptly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Downgrading Instead of Refund</h3>
              <p className="text-muted-foreground">
                If you find that a lower-tier plan better suits your needs, consider downgrading instead 
                of requesting a refund. You can downgrade your plan from your account dashboard, and the 
                change will take effect at your next billing cycle.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Failed Renewal Charges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Failed Renewal Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If your subscription renewal payment fails:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>We will send you an email notification</li>
              <li>We'll attempt to charge your payment method up to 3 times over 10 days</li>
              <li>Your subscription will remain active during this retry period</li>
              <li>If all attempts fail, your subscription will be automatically cancelled</li>
              <li>You can update your payment method in your account dashboard</li>
            </ul>
          </CardContent>
        </Card>

        {/* Enterprise and Custom Plans */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Enterprise and Custom Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Enterprise and custom plans may have different refund terms as specified in your contract. 
              Please refer to your agreement or contact your account manager at <strong>enterprise@instant.tw</strong> for 
              information about refunds on enterprise plans.
            </p>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Questions About Refunds?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              We're here to help! If you have questions about our refund policy or need assistance 
              with a refund request, please don't hesitate to reach out:
            </p>
            <div className="space-y-3 mb-6">
              <div>
                <p className="font-semibold">Refund Requests:</p>
                <p className="text-muted-foreground">billing@instant.tw</p>
              </div>
              <div>
                <p className="font-semibold">Technical Support:</p>
                <p className="text-muted-foreground">wp@instant.tw</p>
              </div>
              <div>
                <p className="font-semibold">General Inquiries:</p>
                <p className="text-muted-foreground">hello@instant.tw</p>
              </div>
              <div>
                <p className="font-semibold">Website:</p>
                <p className="text-muted-foreground">https://instant.tw/</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fair Use Note */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> We reserve the right to refuse refunds for suspected abuse of our 
              refund policy. This includes repeated purchase and refund cycles, or attempts to use our 
              products temporarily without paying. We track refund history and may deny refund requests 
              from customers with a pattern of abuse.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
