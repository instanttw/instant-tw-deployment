"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Zap, Shield, Clock, HardDrive, Globe, CheckCircle, ArrowRight, Database, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";

export default function HostingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { symbol } = useCurrency();

  const pricingPlans = [
    {
      name: "Startup",
      description: "Perfect for new WordPress sites",
      monthlyPrice: 29,
      yearlyPrice: Math.round(29 * 12 * 0.75),
      features: [
        "1 WordPress installation",
        "25,000 visits/month",
        "10 GB storage",
        "50 GB bandwidth",
        "Free SSL certificate",
        "Daily automated backups",
        "99.9% uptime SLA",
        "Global CDN included",
        "24/7 expert support",
        "Staging environment",
        "PHP 8+ support",
      ],
      highlighted: false,
      productId: "hosting-startup",
    },
    {
      name: "Professional",
      description: "For growing businesses",
      monthlyPrice: 69,
      yearlyPrice: Math.round(69 * 12 * 0.75),
      features: [
        "Up to 3 WordPress installations",
        "75,000 visits/month",
        "20 GB storage",
        "200 GB bandwidth",
        "Everything in Startup, plus:",
        "Priority support",
        "Advanced caching",
        "SSH/SFTP access",
        "WP-CLI access",
        "Git integration",
        "Multiple staging environments",
        "Performance monitoring",
      ],
      highlighted: true,
      productId: "hosting-professional",
    },
    {
      name: "Growth",
      description: "For high-traffic websites",
      monthlyPrice: 139,
      yearlyPrice: Math.round(139 * 12 * 0.75),
      features: [
        "Up to 10 WordPress installations",
        "200,000 visits/month",
        "50 GB storage",
        "500 GB bandwidth",
        "Everything in Professional, plus:",
        "Premium CDN (30+ locations)",
        "Advanced security features",
        "Smart plugin updates",
        "Multisite support",
        "On-demand backups",
        "24/7 priority support",
        "Performance optimization",
      ],
      highlighted: false,
      productId: "hosting-growth",
    },
    {
      name: "Scale",
      description: "For enterprise websites",
      monthlyPrice: 299,
      yearlyPrice: Math.round(299 * 12 * 0.75),
      features: [
        "Up to 30 WordPress installations",
        "500,000+ visits/month",
        "100 GB storage",
        "1 TB bandwidth",
        "Everything in Growth, plus:",
        "Dedicated resources",
        "Custom SLA agreements",
        "Advanced security suite",
        "Priority phone support",
        "Dedicated account manager",
        "Custom WordPress configurations",
        "White-glove migrations",
      ],
      highlighted: false,
      productId: "hosting-scale",
    },
  ];

  const features = [
    {
      icon: Server,
      title: "WP-Optimized Infrastructure",
      description: "Servers specifically configured and tuned for WordPress with LiteSpeed/NGINX and PHP 8+.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "SSD storage, Redis object caching, and CDN integration for blazing-fast load times.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced firewalls, malware scanning, DDoS protection, and automated security updates.",
    },
    {
      icon: HardDrive,
      title: "Automated Backups",
      description: "Daily automated backups with one-click restore capability and 30-day retention.",
    },
    {
      icon: Clock,
      title: "99.9% Uptime SLA",
      description: "Industry-leading uptime guarantee with proactive monitoring and instant issue resolution.",
    },
    {
      icon: Globe,
      title: "Global CDN Included",
      description: "Built-in content delivery network to serve your site from locations worldwide.",
    },
  ];

  const includedFeatures = [
    "Free SSL certificates (Let's Encrypt)",
    "Automatic WordPress core updates",
    "Daily malware scanning",
    "DDoS protection & firewall",
    "SSH/SFTP access",
    "WP-CLI command line",
    "Git version control",
    "Staging environments",
    "PHP version management (7.4, 8.0, 8.1, 8.2)",
    "MySQL 8.0 databases",
    "Email support 24/7",
    "99.9% uptime guarantee",
    "Free site migrations",
    "WordPress expert support",
    "Page caching (Varnish/Redis)",
    "CDN with 30+ global locations",
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
              <Server className="h-4 w-4 text-primary" />
              Managed WordPress Hosting
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Premium WordPress Hosting
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Built for Performance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Managed WordPress hosting optimized for speed, security, and reliability. Focus on your content while we handle the technical details.
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
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime SLA</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">&lt;200ms</div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Expert Support</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">15K+</div>
                <p className="text-sm text-muted-foreground">Sites Hosted</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Managed Hosting?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium managed WordPress hosting built by WordPress experts for WordPress sites
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Hosting Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              All plans include premium features, expert support, and our 30-day money-back guarantee
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                        productSlug="hosting"
                        tierName={`${plan.productId.replace('hosting-', '')}-${billingCycle}`}
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
              Need custom hosting? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for enterprise solutions with dedicated resources.
            </p>
          </div>
        </div>
      </section>

      {/* Included Features Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Everything You Need, Included</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Managed Hosting Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Managed WordPress Hosting?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Focus on Your Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stop worrying about server management, updates, and technical issues. We handle everything so you can focus on growing your business.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Cpu className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Better Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    WordPress-optimized infrastructure delivers faster load times, better SEO rankings, and improved user experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Expert Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get help from WordPress experts who understand your platform and can resolve issues quickly, 24/7.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Database className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Peace of Mind</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated backups, security monitoring, and uptime guarantees ensure your site is always protected and available.
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
              Ready to Experience Premium Hosting?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of businesses who trust us with their WordPress hosting. 30-day money-back guarantee on all plans.
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
