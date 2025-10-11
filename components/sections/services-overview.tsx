"use client";

import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp, Lock, Clock, Server, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ServicesOverview() {
  const services = [
    {
      icon: Shield,
      title: "WP Scan",
      description: "Scan your WordPress site for vulnerabilities, outdated plugins, and security issues with our advanced scanner.",
      link: "/services/wp-scan",
      stats: { label: "Sites Scanned", value: "2.5M+" },
      color: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: Clock,
      title: "Maintenance Plans",
      description: "Complete WordPress maintenance including updates, backups, monitoring, and support. Focus on your business while we handle your site.",
      link: "/services/maintenance",
      stats: { label: "Sites Maintained", value: "5,000+" },
      color: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: Zap,
      title: "Speed Optimization",
      description: "Make your WordPress site lightning fast with professional optimization. Improve load times, boost SEO, and increase conversions.",
      link: "/services/speed-optimization",
      stats: { label: "Sites Optimized", value: "3,000+" },
      color: "from-yellow-500/10 to-orange-500/10",
    },
    {
      icon: Lock,
      title: "Security Services",
      description: "Comprehensive WordPress security including malware scanning, firewall protection, security hardening, and 24/7 monitoring.",
      link: "/services/security",
      stats: { label: "Threats Blocked", value: "10K+" },
      color: "from-red-500/10 to-pink-500/10",
    },
    {
      icon: TrendingUp,
      title: "SEO Services",
      description: "Rank higher on Google with professional WordPress SEO. Technical optimization, content strategy, and link building.",
      link: "/services/seo",
      stats: { label: "Keywords Ranked", value: "3,200+" },
      color: "from-purple-500/10 to-indigo-500/10",
    },
    {
      icon: Server,
      title: "Managed Hosting",
      description: "Premium WordPress hosting optimized for speed, security, and reliability. Powerful hosting infrastructure with daily backups and 99.9% uptime guarantee.",
      link: "/services/hosting",
      stats: { label: "Active Sites", value: "8,500+" },
      color: "from-blue-500/10 to-indigo-500/10",
      comingSoon: false,
    },
  ];

  const overallStats = [
    { label: "Total Sites", value: "12,000+", description: "Managed & secured" },
    { label: "Uptime SLA", value: "99.9%", description: "Guaranteed availability" },
    { label: "Support Response", value: "<1hr", description: "Average response time" },
    { label: "Years Experience", value: "10+", description: "WordPress expertise" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete WordPress Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to keep your WordPress website secure, fast, and successful
          </p>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {overallStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    {service.comingSoon && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="min-h-[60px]">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-secondary/30">
                    <span className="text-sm text-muted-foreground">{service.stats.label}</span>
                    <span className="text-lg font-bold text-primary">{service.stats.value}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:border-primary group-hover:text-primary transition-colors" 
                    asChild
                  >
                    <Link href={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View All Pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Need a custom solution? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for enterprise packages
          </p>
        </motion.div>
      </div>
    </section>
  );
}
