"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, Shield, TrendingUp, Clock, Globe, FileText, Mail, Webhook, Code, Lock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";

export default function WPScanPlansPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { data: session } = useSession();

  const plans = [
    {
      name: "Free",
      icon: Shield,
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for trying out WP Scan",
      features: [
        "Unlimited scans",
        "Basic vulnerability detection",
        "View scan results immediately",
        "Detection confidence scores",
        "WordPress core version check",
        "Plugin & theme detection",
      ],
      limitations: [
        "Cannot save scan history",
        "No CVE details",
        "No automated scans",
        "No alerts",
        "No PDF exports",
      ],
      cta: "Current Plan",
      ctaVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      icon: Zap,
      price: { monthly: 49, yearly: 441 },
      description: "For professionals monitoring multiple sites",
      features: [
        "Everything in Free",
        "Save scan history",
        "Monitor up to 3 websites",
        "Weekly automated scans",
        "Full CVE vulnerability details",
        "CVSS scores & risk ratings",
        "PDF report exports",
        "Email alerts for new vulnerabilities",
        "Scan comparison & trends",
        "Priority email support",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      ctaVariant: "default" as const,
      popular: true,
    },
    {
      name: "Agency",
      icon: Building2,
      price: { monthly: 149, yearly: 1341 },
      description: "For agencies managing client websites",
      features: [
        "Everything in Pro",
        "Monitor up to 25 websites",
        "Daily automated scans",
        "White-label PDF reports",
        "Custom branding & logo",
        "Slack webhook integrations",
        "Advanced vulnerability filters",
        "Historical data (12 months)",
        "Team collaboration (5 users)",
        "Priority support",
      ],
      limitations: [],
      cta: "Upgrade to Agency",
      ctaVariant: "default" as const,
      popular: false,
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: { monthly: 499, yearly: 4491 },
      description: "For large organizations with custom needs",
      features: [
        "Everything in Agency",
        "Unlimited websites",
        "Real-time monitoring",
        "Custom scan intervals",
        "Full API access",
        "Custom webhooks",
        "SSO & SAML authentication",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom integrations",
        "Unlimited team members",
        "24/7 phone support",
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "default" as const,
      popular: false,
    },
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return "Free";
    const price = billingCycle === "monthly" ? plan.price.monthly : Math.floor(plan.price.yearly / 12);
    return `$${price}`;
  };

  const getOriginalYearlyPrice = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return null;
    return plan.price.monthly * 12;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.price.monthly === 0) return null;
    const original = getOriginalYearlyPrice(plan);
    if (!original) return null;
    const savings = original - plan.price.yearly;
    const percentage = Math.round((savings / original) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                WP Scan Plan
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Protect your WordPress websites with continuous monitoring and advanced security scanning
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
              />
              <span className={billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}>
                Yearly
                <span className="ml-2 text-sm text-green-600 font-medium">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <plan.icon className="h-6 w-6 text-primary" />
                      </div>
                      {plan.popular && (
                        <Crown className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{getPrice(plan)}</span>
                        {plan.price.monthly > 0 && (
                          <span className="text-muted-foreground">
                            /{billingCycle === "monthly" ? "mo" : "mo"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "yearly" && plan.price.monthly > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground line-through">
                            ${getOriginalYearlyPrice(plan)}/year
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            Save ${getSavings(plan)?.amount} ({getSavings(plan)?.percentage}% off)
                          </p>
                        </div>
                      )}
                      {billingCycle === "yearly" && plan.price.yearly > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Billed ${plan.price.yearly} yearly
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Features:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-muted-foreground">Not included:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation) => (
                            <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-lg leading-none">×</span>
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.name === "Free" ? (
                      <Button
                        className="w-full"
                        variant={plan.ctaVariant}
                        size="lg"
                        asChild
                      >
                        {session ? (
                          <Link href="/dashboard/wp-scan">{plan.cta}</Link>
                        ) : (
                          <Link href="/signup">{plan.cta}</Link>
                        )}
                      </Button>
                    ) : plan.name === "Enterprise" ? (
                      <Button
                        className="w-full"
                        variant={plan.ctaVariant}
                        size="lg"
                        asChild
                      >
                        <Link href="/contact?subject=Enterprise%20Plan">
                          {plan.cta}
                        </Link>
                      </Button>
                    ) : (
                      <UnifiedCheckoutButton
                        productSlug="wp-scan"
                        tierName={`${plan.name.toLowerCase()}-${billingCycle}`}
                        variant={plan.ctaVariant}
                        size="lg"
                        className="w-full"
                      >
                        {plan.cta}
                      </UnifiedCheckoutButton>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-lg text-muted-foreground">
              Detailed breakdown of what's included in each plan
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4 bg-primary/5">Pro</th>
                  <th className="text-center py-4 px-4">Agency</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Unlimited Scans", free: true, pro: true, agency: true, enterprise: true },
                  { feature: "Save Scan History", free: false, pro: true, agency: true, enterprise: true },
                  { feature: "Monitored Websites", free: "0", pro: "3", agency: "25", enterprise: "Unlimited" },
                  { feature: "Scan Frequency", free: "Manual", pro: "Weekly", agency: "Daily", enterprise: "Real-time" },
                  { feature: "CVE Details", free: false, pro: true, agency: true, enterprise: true },
                  { feature: "CVSS Scores", free: false, pro: true, agency: true, enterprise: true },
                  { feature: "PDF Exports", free: false, pro: true, agency: true, enterprise: true },
                  { feature: "Email Alerts", free: false, pro: true, agency: true, enterprise: true },
                  { feature: "White-label Reports", free: false, pro: false, agency: true, enterprise: true },
                  { feature: "API Access", free: false, pro: false, agency: false, enterprise: true },
                  { feature: "Webhooks", free: false, pro: false, agency: "Slack", enterprise: "Custom" },
                  { feature: "Team Members", free: "1", pro: "1", agency: "5", enterprise: "Unlimited" },
                  { feature: "Support", free: "Community", pro: "Email", agency: "Priority", enterprise: "24/7 Phone" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-secondary/5">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : "—"
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : "—"
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.agency === "boolean" ? (
                        row.agency ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : "—"
                      ) : (
                        row.agency
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : "—"
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade my plan anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged a prorated amount. Downgrades take effect at the next billing cycle."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via invoice."
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Our Free plan is available forever with no time limit. You can upgrade anytime to unlock premium features."
              },
              {
                q: "What happens if I exceed my website limit?",
                a: "You'll be prompted to upgrade to a higher tier. Your existing scans and data will be preserved."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
              },
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your WordPress Sites?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start monitoring your websites today with our powerful security scanner
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/wp-scan">
                Try Free Scanner
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
