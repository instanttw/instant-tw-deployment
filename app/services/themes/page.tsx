"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Smartphone, Layout, Sparkles, Code, Zap, CheckCircle, ArrowRight, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";

export default function ThemesPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { symbol } = useCurrency();

  const pricingPlans = [
    {
      name: "Pro",
      description: "Custom theme design & development",
      monthlyPrice: 99,
      yearlyPrice: Math.round(99 * 12 * 0.75),
      features: [
        "1 domain",
        "Custom theme design",
        "Mobile-responsive layout",
        "Up to 10 page templates",
        "Basic custom post types",
        "Theme documentation",
        "1 month post-launch support",
        "Performance optimization",
        "SEO-friendly markup",
        "Browser compatibility testing",
      ],
      highlighted: false,
      productId: "themes-pro",
    },
    {
      name: "Agency",
      description: "Advanced theme customization",
      monthlyPrice: 599,
      yearlyPrice: Math.round(599 * 12 * 0.75),
      features: [
        "10-50 domains",
        "Premium custom theme design",
        "Advanced mobile optimization",
        "Unlimited page templates",
        "Advanced custom post types",
        "WooCommerce integration",
        "Custom Gutenberg blocks",
        "Animation & interactions",
        "3 months post-launch support",
        "A/B testing setup",
        "Conversion optimization",
        "White-label ready",
        "Priority support",
      ],
      highlighted: true,
      productId: "themes-agency",
    },
    {
      name: "Enterprise",
      description: "Full design system & ongoing support",
      monthlyPrice: 1299,
      yearlyPrice: Math.round(1299 * 12 * 0.75),
      features: [
        "Unlimited domains",
        "Complete design system",
        "Multi-site theme framework",
        "Headless WordPress support",
        "Custom page builder",
        "Advanced WooCommerce features",
        "Progressive Web App (PWA)",
        "Multilingual support",
        "Accessibility (WCAG) compliance",
        "6 months post-launch support",
        "Monthly design updates",
        "Dedicated design team",
        "Performance monitoring",
        "24/7 priority support",
        "Custom SLA agreements",
      ],
      highlighted: false,
      productId: "themes-enterprise",
    },
  ];

  const features = [
    {
      icon: Palette,
      title: "Custom Design",
      description: "Unique, brand-aligned designs that make your WordPress site stand out from the competition.",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Perfect display across all devices - desktop, tablet, and mobile with fluid responsive layouts.",
    },
    {
      icon: Layout,
      title: "Page Builder Ready",
      description: "Compatible with popular page builders like Elementor, Divi, and Gutenberg for easy editing.",
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Lightning-fast load times with clean, optimized code and best practices implementation.",
    },
    {
      icon: Eye,
      title: "UX/UI Excellence",
      description: "User-centered design focused on navigation, usability, and converting visitors to customers.",
    },
    {
      icon: Code,
      title: "Clean Code",
      description: "Well-structured, documented code following WordPress coding standards for easy maintenance.",
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
              <Palette className="h-4 w-4 text-primary" />
              WordPress Theme Design & Customization
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Beautiful Custom WordPress Themes
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Built for Your Brand
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Professional WordPress theme design and development. Custom designs that capture your brand identity and deliver exceptional user experiences.
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
                <Link href="/contact">Request Consultation</Link>
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
                <div className="text-3xl font-bold text-primary">500+</div>
                <p className="text-sm text-muted-foreground">Themes Created</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">95+</div>
                <p className="text-sm text-muted-foreground">PageSpeed Score</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Responsive</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Theme Development</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every theme we create is designed with performance, usability, and your brand in mind
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Theme Package</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional WordPress theme design and development with ongoing support
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
                        productSlug="themes"
                        tierName={`${plan.productId.replace('themes-', '')}-${billingCycle}`}
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
              Need a custom quote? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for enterprise solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Why Custom Themes Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Custom Themes?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Unique Brand Identity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stand out from competitors with a custom design tailored to your brand. No cookie-cutter templates or generic looks.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Better Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Custom themes are built lean without unnecessary bloat, resulting in faster load times and better SEO rankings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Enhanced User Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Designed specifically for your users' needs with optimized navigation, layout, and conversion pathways.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Code className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Full Control & Flexibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You own the code completely. Modify, extend, and customize without limitations or licensing restrictions.
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
              Ready to Transform Your WordPress Site?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let's create a stunning custom theme that perfectly represents your brand and delights your visitors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  Choose Your Package
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
