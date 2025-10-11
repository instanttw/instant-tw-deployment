"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileWarning, Bell, CheckCircle, ArrowRight, Server, Key, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";

export default function SecurityServicesPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { symbol } = useCurrency();

  const pricingPlans = [
    {
      name: "Pro",
      description: "Essential security for small sites",
      monthlyPrice: 99,
      yearlyPrice: Math.round(99 * 12 * 0.75),
      features: [
        "Up to 3 websites",
        "Daily malware scanning",
        "Firewall setup & configuration",
        "SSL/TLS certificate management",
        "Brute force protection",
        "Basic security hardening",
        "Login security (2FA, reCAPTCHA)",
        "Security monitoring",
        "Monthly security reports",
        "Malware removal (basic)",
        "Emergency support",
      ],
      highlighted: false,
      productId: "security-pro",
    },
    {
      name: "Agency",
      description: "Advanced protection for agencies",
      monthlyPrice: 299,
      yearlyPrice: Math.round(299 * 12 * 0.75),
      features: [
        "Up to 15 websites",
        "Real-time malware scanning",
        "Advanced firewall (WAF)",
        "DDoS protection",
        "Advanced security hardening",
        "File integrity monitoring",
        "Database security",
        "Vulnerability scanning",
        "Security audit & pen testing",
        "Comprehensive malware removal",
        "Weekly security reports",
        "Priority security alerts",
        "White-label reports",
        "24/7 security monitoring",
      ],
      highlighted: true,
      productId: "security-agency",
    },
    {
      name: "Enterprise",
      description: "Maximum security for enterprises",
      monthlyPrice: 999,
      yearlyPrice: Math.round(999 * 12 * 0.75),
      features: [
        "Unlimited websites",
        "Continuous security monitoring",
        "Enterprise-grade WAF",
        "Advanced DDoS protection",
        "Custom security policies",
        "Intrusion detection system (IDS)",
        "Security incident response",
        "Forensic analysis",
        "Compliance audits (GDPR, PCI-DSS)",
        "Advanced threat intelligence",
        "Dedicated security specialist",
        "Real-time security dashboard",
        "24/7 security operations center",
        "Custom SLA agreements",
        "Insurance-backed guarantees",
      ],
      highlighted: false,
      productId: "security-enterprise",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Malware Scanning & Removal",
      description: "Automated daily scans to detect malware, backdoors, and suspicious code. Professional removal included.",
    },
    {
      icon: Lock,
      title: "Firewall Protection",
      description: "Web Application Firewall (WAF) to block malicious traffic, SQL injections, and XSS attacks.",
    },
    {
      icon: Eye,
      title: "24/7 Security Monitoring",
      description: "Round-the-clock monitoring for suspicious activity, unauthorized access attempts, and security threats.",
    },
    {
      icon: Key,
      title: "Access Control & Hardening",
      description: "Implement 2FA, strong passwords, limit login attempts, and harden WordPress configuration.",
    },
    {
      icon: FileWarning,
      title: "Vulnerability Scanning",
      description: "Regular scans for known vulnerabilities in WordPress core, plugins, and themes.",
    },
    {
      icon: Bell,
      title: "Instant Security Alerts",
      description: "Immediate notifications for security incidents, malware detection, or suspicious activity.",
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
              <Shield className="h-4 w-4 text-primary" />
              WordPress Security Services
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
            >
              Protect Your WordPress Site
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                From Hackers & Malware
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
            >
              Comprehensive WordPress security services including malware scanning, firewall protection, security hardening, and 24/7 monitoring.
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
                <Link href="/contact">Get Security Audit</Link>
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
                <div className="text-3xl font-bold text-primary">10K+</div>
                <p className="text-sm text-muted-foreground">Threats Blocked</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <p className="text-sm text-muted-foreground">Attack Prevention</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-primary">4,500+</div>
                <p className="text-sm text-muted-foreground">Sites Protected</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Security Protection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multi-layered security approach to keep your WordPress site safe from all threats
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Security Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Professional WordPress security with 24/7 monitoring and instant threat response
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
                        productSlug="security"
                        tierName={`${plan.productId.replace('security-', '')}-${billingCycle}`}
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
              Need a security audit? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for a comprehensive security assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Why Security Matters Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Security Matters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>WordPress is a Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    90,000+ WordPress sites are hacked daily. Don't become a statistic - protect your site with professional security services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Server className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Business Continuity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A hacked website means lost revenue, damaged reputation, and potential customer data breaches. Prevention is always cheaper than recovery.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>SEO Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Google blacklists hacked sites, devastating your search rankings. Security is crucial for maintaining your online presence.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Customer Trust</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visitors trust secure sites. SSL, regular updates, and security badges build confidence and increase conversions.
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
              Don't Wait Until It's Too Late
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Protect your WordPress site now with professional security services and sleep better at night.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#pricing">
                  Choose Your Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get Free Security Audit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
