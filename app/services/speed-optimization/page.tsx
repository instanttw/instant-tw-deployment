"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Image, Database, Code, Server, Globe, CheckCircle, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";

export default function SpeedOptimizationPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { symbol } = useCurrency();

  const pricingPlans = [
    {
      name: "Pro",
      description: "For small to medium websites",
      monthlyPrice: 79,
      yearlyPrice: Math.round(79 * 12 * 0.75),
      features: [
        "Up to 3 websites",
        "Complete speed audit",
        "Image optimization (WebP conversion)",
        "Caching setup & configuration",
        "Database optimization",
        "Minify CSS/JS",
        "Lazy loading implementation",
        "Basic CDN setup",
        "Mobile optimization",
        "Core Web Vitals optimization",
        "Monthly performance monitoring",
        "Performance reports",
      ],
      highlighted: false,
      productId: "speed-pro",
    },
    {
      name: "Agency",
      description: "For agencies & high-traffic sites",
      monthlyPrice: 199,
      yearlyPrice: Math.round(199 * 12 * 0.75),
      features: [
        "Up to 10 websites",
        "Advanced speed audit",
        "Premium image optimization",
        "Advanced caching strategies",
        "Database cleanup & optimization",
        "Critical CSS generation",
        "Code splitting & optimization",
        "Premium CDN with custom rules",
        "Server-level optimization",
        "WooCommerce speed optimization",
        "Weekly performance monitoring",
        "White-label reports",
        "Priority support",
        "Performance SLA guarantee",
      ],
      highlighted: true,
      productId: "speed-agency",
    },
    {
      name: "Enterprise",
      description: "For enterprise & mission-critical sites",
      monthlyPrice: 499,
      yearlyPrice: Math.round(499 * 12 * 0.75),
      features: [
        "Unlimited websites",
        "Comprehensive performance audit",
        "Enterprise image optimization",
        "Custom caching solutions",
        "Advanced database optimization",
        "Full-stack code optimization",
        "Custom CDN configuration",
        "Server architecture review",
        "Load balancing setup",
        "Real-time performance monitoring",
        "Continuous optimization",
        "Dedicated performance specialist",
        "24/7 priority support",
        "Custom SLA agreements",
        "Performance consulting included",
      ],
      highlighted: false,
      productId: "speed-enterprise",
    },
  ];

  const features = [
    {
      icon: Image,
      title: "Image Optimization",
      description: "Compress and convert images to WebP format, implement lazy loading, and optimize delivery for faster page loads.",
    },
    {
      icon: Database,
      title: "Database Optimization",
      description: "Clean up unnecessary data, optimize tables, remove post revisions, and improve query performance.",
    },
    {
      icon: Code,
      title: "Code Minification",
      description: "Minify CSS, JavaScript, and HTML. Remove unused code and implement code splitting for optimal performance.",
    },
    {
      icon: Server,
      title: "Caching Setup",
      description: "Configure browser caching, server-side caching, object caching, and implement page caching strategies.",
    },
    {
      icon: Globe,
      title: "CDN Integration",
      description: "Set up and configure Content Delivery Network to serve static assets from locations closest to your visitors.",
    },
    {
      icon: TrendingUp,
      title: "Core Web Vitals",
      description: "Optimize LCP, FID, and CLS scores to meet Google's Core Web Vitals standards for better SEO rankings.",
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
              <Zap className="h-4 w-4 text-primary" />
              WordPress Speed Optimization
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Make Your WordPress Site
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lightning Fast
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Professional WordPress speed optimization service. Improve load times, boost SEO rankings, and deliver better user experiences.
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
                <Link href="/contact">Get Free Audit</Link>
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
                <div className="text-3xl font-bold text-primary">60%</div>
                <p className="text-sm text-muted-foreground">Avg Speed Increase</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">&lt;2s</div>
                <p className="text-sm text-muted-foreground">Load Time</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">95+</div>
                <p className="text-sm text-muted-foreground">PageSpeed Score</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">3,000+</div>
                <p className="text-sm text-muted-foreground">Sites Optimized</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Speed Optimization</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We optimize every aspect of your WordPress site for maximum performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Speed Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional WordPress speed optimization with ongoing performance monitoring
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
                        productSlug="speed-optimization"
                        tierName={`${plan.productId.replace('speed-', '')}-${billingCycle}`}
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
              Need a one-time optimization? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for custom pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Why Speed Matters Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Speed Matters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Better User Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    53% of mobile users abandon sites that take longer than 3 seconds to load. Faster sites keep visitors engaged and reduce bounce rates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Improved SEO Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Google uses Core Web Vitals as a ranking factor. Faster sites rank higher in search results, driving more organic traffic.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Higher Conversion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A 1-second delay in page load time can lead to a 7% reduction in conversions. Speed directly impacts your bottom line.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Server className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Reduced Server Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Optimized sites use fewer server resources, reducing hosting costs and allowing you to handle more traffic on the same infrastructure.
                  </p>
                </CardContent>
              </Card>
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
              Ready to Speed Up Your WordPress Site?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get professional WordPress speed optimization and start seeing results in days, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  Choose Your Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Request Free Audit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
