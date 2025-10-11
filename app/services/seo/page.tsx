"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Search, FileText, Link as LinkIcon, Target, BarChart, CheckCircle, ArrowRight, Globe, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";
import { ServiceSchema } from '@/components/seo/service-schema';

export default function SEOServicesPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { symbol } = useCurrency();

  const pricingPlans = [
    {
      name: "Pro",
      description: "Essential SEO for small businesses",
      monthlyPrice: 99,
      yearlyPrice: Math.round(99 * 12 * 0.75),
      features: [
        "Up to 3 websites",
        "Complete SEO audit",
        "Keyword research & strategy",
        "On-page SEO optimization",
        "Technical SEO fixes",
        "Meta titles & descriptions",
        "XML sitemap optimization",
        "Google Search Console setup",
        "Core Web Vitals optimization",
        "Monthly performance reports",
        "10 content optimizations/month",
      ],
      highlighted: false,
      productId: "seo-pro",
    },
    {
      name: "Agency",
      description: "Advanced SEO for growing businesses",
      monthlyPrice: 499,
      yearlyPrice: Math.round(499 * 12 * 0.75),
      features: [
        "Up to 10 websites",
        "Advanced SEO audit",
        "Comprehensive keyword research",
        "Advanced on-page optimization",
        "Technical SEO implementation",
        "Schema markup implementation",
        "Internal linking strategy",
        "Competitor analysis",
        "Backlink analysis & strategy",
        "Local SEO optimization",
        "Content strategy development",
        "25 content optimizations/month",
        "Biweekly performance reports",
        "Priority support",
      ],
      highlighted: true,
      productId: "seo-agency",
    },
    {
      name: "Enterprise",
      description: "Full-service SEO for enterprises",
      monthlyPrice: 1499,
      yearlyPrice: Math.round(1499 * 12 * 0.75),
      features: [
        "Unlimited websites",
        "Enterprise SEO strategy",
        "Advanced keyword research & tracking",
        "Complete technical SEO",
        "Advanced schema implementation",
        "E-commerce SEO optimization",
        "International SEO",
        "Link building campaigns",
        "Content marketing strategy",
        "Conversion rate optimization",
        "Unlimited content optimizations",
        "Weekly performance reports",
        "Dedicated SEO specialist",
        "White-label reports",
        "24/7 priority support",
      ],
      highlighted: false,
      productId: "seo-enterprise",
    },
  ];

  const features = [
    {
      icon: Search,
      title: "Keyword Research",
      description: "In-depth keyword research to identify high-value search terms and opportunities for your business.",
    },
    {
      icon: Code,
      title: "Technical SEO",
      description: "Fix technical issues including crawl errors, broken links, site speed, mobile optimization, and Core Web Vitals.",
    },
    {
      icon: FileText,
      title: "On-Page Optimization",
      description: "Optimize content, meta tags, headings, images, and internal linking for better search rankings.",
    },
    {
      icon: LinkIcon,
      title: "Link Building",
      description: "Build high-quality backlinks from authoritative websites to improve domain authority and rankings.",
    },
    {
      icon: Target,
      title: "Local SEO",
      description: "Optimize for local search with Google My Business, local citations, and location-based keywords.",
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Comprehensive tracking and reporting on rankings, traffic, conversions, and ROI.",
    },
  ];

  return (
    <>
      <ServiceSchema
        name="WordPress SEO Services"
        description="Professional WordPress SEO services including technical optimization, on-page SEO, content strategy, keyword research, and link building to improve your search engine rankings and drive more organic traffic."
        serviceType="WordPress SEO"
        priceRange="$99-$1499"
        url="https://wp.instant.tw/services/seo"
        aggregateRating={{
          ratingValue: 4.9,
          reviewCount: 623,
        }}
      />
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
              <TrendingUp className="h-4 w-4 text-primary" />
              WordPress SEO Services
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Rank Higher on Google
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Drive More Organic Traffic
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Professional WordPress SEO services including technical optimization, content strategy, and link building to improve your search rankings.
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
                <Link href="/contact">Get Free SEO Audit</Link>
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
                <div className="text-3xl font-bold text-primary">250%</div>
                <p className="text-sm text-muted-foreground">Avg Traffic Increase</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">#1-3</div>
                <p className="text-sm text-muted-foreground">Avg Rankings</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">3,200+</div>
                <p className="text-sm text-muted-foreground">Keywords Ranked</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">500+</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive SEO Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to improve your search rankings and drive organic traffic
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your SEO Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional WordPress SEO services with proven results
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
                        productSlug="seo"
                        tierName={`${plan.productId.replace('seo-', '')}-${billingCycle}`}
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
              Need a custom SEO strategy? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for enterprise solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Why SEO Matters Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why SEO Matters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Organic Traffic Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SEO drives sustainable, long-term traffic growth without paying for ads. Rank higher and attract qualified visitors.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Better ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SEO delivers the highest ROI of any marketing channel. Once you rank, you get consistent traffic without ongoing ad spend.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Competitive Advantage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you're not ranking, your competitors are. SEO helps you capture market share and establish authority in your niche.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Increased Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Organic visitors convert better than paid traffic. They're actively searching for solutions and more likely to become customers.
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
              Ready to Rank Higher on Google?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get professional WordPress SEO services and start driving more organic traffic to your website.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  Choose Your Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get Free SEO Audit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
