"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useCurrency } from "@/lib/currency-context";
import { Switch } from "@/components/ui/switch";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";
import { NextSeo } from 'next-seo';

const plansData = [
  {
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 441, // 25% off (49 * 12 * 0.75 = 441)
    websites: "3 websites",
    description: "Best for individuals and small businesses",
    features: [
      "All 12 premium plugins included",
      "Use on up to 3 websites",
      "1 year of updates & support",
      "Priority email support",
      "Premium documentation",
      "Advanced features unlocked",
      "30-day money-back guarantee",
      "Free plugin updates",
    ],
    cta: "Get Pro",
    highlighted: false,
    productId: "plugins-pro", // Plugin Bundle Pro
  },
  {
    name: "Agency",
    monthlyPrice: 299,
    yearlyPrice: 2691, // 25% off (299 * 12 * 0.75 = 2691)
    websites: "25 websites",
    description: "Perfect for agencies managing multiple clients",
    features: [
      "All 12 premium plugins included",
      "Use on up to 25 websites",
      "1 year of updates & support",
      "Priority email & phone support",
      "White label options",
      "API access",
      "Custom integrations",
      "Advanced analytics",
      "Dedicated account manager",
      "Early access to new features",
    ],
    cta: "Get Agency",
    highlighted: true,
    productId: "plugins-agency", // Plugin Bundle Agency
  },
  {
    name: "Enterprise",
    monthlyPrice: 999,
    yearlyPrice: 8991, // 25% off (999 * 12 * 0.75 = 8991)
    websites: "Unlimited sites",
    description: "Custom solutions for large organizations",
    features: [
      "All 12 premium plugins included",
      "Unlimited websites",
      "Lifetime updates & support",
      "24/7 priority support",
      "Dedicated account manager",
      "Custom SLA guarantee",
      "On-site training available",
      "Custom development",
      "Security audits",
      "Compliance assistance",
      "Dedicated infrastructure",
      "Premium white-label options",
    ],
    cta: "Get Enterprise",
    highlighted: false,
    productId: "plugins-enterprise", // Plugin Bundle Enterprise
  },
];

export default function PricingPage() {
  const { formatPrice, symbol } = useCurrency();
  const [isYearly, setIsYearly] = useState(false);

  const getDisplayPrice = (plan: typeof plansData[0]) => {
    if (isYearly) {
      return formatPrice(plan.yearlyPrice);
    }
    return formatPrice(plan.monthlyPrice);
  };

  const getMonthlyEquivalent = (plan: typeof plansData[0]) => {
    if (isYearly) {
      const monthlyEquiv = Math.round(plan.yearlyPrice / 12);
      return `${symbol}${monthlyEquiv}/month`;
    }
    return null;
  };

  return (
    <>
      <NextSeo
        title="Pricing - Premium WordPress Plugins & Services"
        description="Affordable pricing for premium WordPress plugins. Pro plans from $49/month, Agency plans from $299/month. All plans include 12+ premium plugins, priority support, and 25% off annual billing. 30-day money-back guarantee."
        canonical="https://wp.instant.tw/pricing"
        openGraph={{
          url: 'https://wp.instant.tw/pricing',
          title: 'Pricing - Premium WordPress Plugins & Services',
          description: 'Simple, transparent pricing for premium WordPress plugins. Choose Pro, Agency, or Enterprise plans.',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'WordPress plugin pricing, premium plugin cost, WordPress plugin bundles, WordPress services pricing',
          },
        ]}
      />
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that&apos;s right for you. All plans include all 12 premium plugins and a 30-day money-back guarantee.
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${!isYearly ? 'font-bold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-lg ${isYearly ? 'font-bold' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <span className="ml-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Save 25%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plansData.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-105"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.websites}</CardDescription>
                <CardDescription className="mt-1">{plan.description}</CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{getDisplayPrice(plan)}</span>
                    <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {getMonthlyEquivalent(plan)} billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1">
                <div className="mb-6">
                  <UnifiedCheckoutButton
                    productSlug="plugin-bundle"
                    tierName={`${plan.productId.replace('plugins-', '')}-${isYearly ? 'yearly' : 'monthly'}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full h-11"
                  >
                    {plan.cta}
                  </UnifiedCheckoutButton>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Can I upgrade or downgrade my plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. When upgrading,
                  you&apos;ll only pay the prorated difference. When downgrading, the credit
                  will be applied to your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What&apos;s your refund policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee on all paid plans. If you&apos;re not
                  satisfied with our plugins, contact our support team for a full refund.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How many websites can I use the plugins on?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pro plan includes 3 websites, Agency includes 25 websites, and Enterprise includes
                  unlimited websites. You can easily manage and track all your licensed sites from your dashboard.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you offer discounts for non-profits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer special pricing for non-profit organizations and educational
                  institutions. Contact our sales team for more information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.
                  Enterprise plans can also pay via wire transfer or invoice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What happens after my subscription ends?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your plugins will continue to work, but you won&apos;t receive updates or support.
                  You can renew at any time to continue receiving updates and premium support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
