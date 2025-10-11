"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Zap, CheckCircle, Bell, FileText, Headphones, Database, Lock, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";

export default function MaintenancePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { symbol } = useCurrency();

  const pricingPlans = [
    {
      name: "Pro",
      description: "Perfect for small businesses & freelancers",
      monthlyPrice: 49,
      yearlyPrice: Math.round(49 * 12 * 0.75),
      features: [
        "Up to 3 websites",
        "Weekly security & plugin updates",
        "Daily automated backups (30-day retention)",
        "Uptime monitoring (15-min intervals)",
        "Malware scanning & removal",
        "Performance optimization (quarterly)",
        "2 hours/month support",
        "Email support (24hr response)",
        "Monthly health reports",
      ],
      highlighted: false,
      productId: "maintenance-pro",
    },
    {
      name: "Agency",
      description: "For agencies managing multiple clients",
      monthlyPrice: 149,
      yearlyPrice: Math.round(149 * 12 * 0.75),
      features: [
        "Up to 15 websites",
        "Daily security & plugin updates",
        "Hourly automated backups (90-day retention)",
        "Uptime monitoring (5-min intervals)",
        "Priority malware scanning & removal",
        "Performance optimization (monthly)",
        "10 hours/month support",
        "White-label reports for clients",
        "Priority support (4hr response)",
        "Emergency support included",
        "Staging environment setup",
      ],
      highlighted: true,
      productId: "maintenance-agency",
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      monthlyPrice: 499,
      yearlyPrice: Math.round(499 * 12 * 0.75),
      features: [
        "Unlimited websites",
        "Real-time security & plugin updates",
        "Continuous backups with instant restore",
        "Uptime monitoring (1-min intervals)",
        "Advanced malware scanning & removal",
        "Performance optimization (weekly)",
        "Unlimited support hours",
        "Custom SLA agreements",
        "Dedicated account manager",
        "24/7 priority support (1hr response)",
        "Emergency hotline",
        "Custom development included",
        "Disaster recovery planning",
      ],
      highlighted: false,
      productId: "maintenance-enterprise",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Security Updates",
      description: "Keep your WordPress core, themes, and plugins updated to patch vulnerabilities before they're exploited.",
    },
    {
      icon: Database,
      title: "Automated Backups",
      description: "Daily automated backups stored securely off-site with one-click restore capability.",
    },
    {
      icon: Activity,
      title: "Uptime Monitoring",
      description: "24/7 monitoring with instant alerts if your site goes down, ensuring maximum availability.",
    },
    {
      icon: Lock,
      title: "Malware Scanning",
      description: "Regular malware and vulnerability scans with professional removal if threats are detected.",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Regular speed audits, caching configuration, image optimization, and database cleanup.",
    },
    {
      icon: FileText,
      title: "Monthly Reports",
      description: "Detailed monthly reports covering security, performance, uptime, and maintenance activities.",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "Direct access to WordPress experts for troubleshooting, fixes, and technical guidance.",
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      description: "Immediate notifications for critical issues, downtime, or security threats via email and SMS.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-2 text-sm font-medium"
            >
              <Clock className="h-4 w-4 text-primary" />
              WordPress Maintenance & Care Plans
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Focus on Your Business
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                We'll Handle Your WordPress
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Comprehensive WordPress maintenance, security updates, backups, and expert support. Keep your website secure, fast, and running smoothly 24/7.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild>
                <Link href="#pricing">
                  View Pricing Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">5,000+</div>
                <p className="text-sm text-muted-foreground">Sites Maintained</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime Guarantee</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">&lt;1hr</div>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete WordPress Care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to keep your WordPress website secure, fast, and running smoothly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Maintenance Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              All plans include security updates, backups, monitoring, and expert support
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
              />
              <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly <span className="text-primary">(Save 25%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const period = billingCycle === "monthly" ? "/month" : "/year";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`h-full ${plan.highlighted ? "border-primary/50 shadow-lg ring-2 ring-primary/20" : ""}`}>
                    <CardHeader>
                      {plan.highlighted && (
                        <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                      )}
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{symbol}{price}</span>
                        <span className="text-muted-foreground">{period}</span>
                      </div>
                      {billingCycle === "yearly" && (
                        <p className="text-sm text-primary mt-2">
                          {symbol}{(price / 12).toFixed(2)}/month billed annually
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <UnifiedCheckoutButton
                        productSlug="maintenance"
                        tierName={`${plan.productId.replace('maintenance-', '')}-${billingCycle}`}
                        variant={plan.highlighted ? "default" : "outline"}
                        className="w-full"
                      >
                        Get Started
                      </UnifiedCheckoutButton>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Need a custom plan? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for enterprise solutions.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What's Included in Every Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "WordPress core updates",
                "Plugin & theme updates",
                "Security monitoring",
                "Malware scanning & removal",
                "Daily automated backups",
                "Uptime monitoring",
                "Performance optimization",
                "Database optimization",
                "Spam protection",
                "Broken link fixes",
                "SSL certificate management",
                "Emergency support",
                "Monthly health reports",
                "Content updates (within hours limit)",
                "Expert WordPress support",
                "99.9% uptime SLA",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Stop Worrying About Your WordPress Site?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of businesses who trust us to keep their WordPress websites secure, fast, and running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  Choose Your Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
