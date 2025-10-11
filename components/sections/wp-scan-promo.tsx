"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function WPScanPromo() {
  const t = useTranslations("home");
  
  const features = [
    t("wpScanPromo.features.0"),
    t("wpScanPromo.features.1"),
    t("wpScanPromo.features.2"),
    t("wpScanPromo.features.3"),
  ];
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium mb-6">
              <Shield className="h-4 w-4 text-primary" />
              {t("wpScanPromo.badge")}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t("wpScanPromo.title")}
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("wpScanPromo.subtitle")}
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              {t("wpScanPromo.description")}
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link href="/wp-scan">
                  {t("wpScanPromo.ctaPrimary")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/wp-scan#pricing">
                  {t("wpScanPromo.ctaSecondary")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              {
                icon: Shield,
                value: "2.5M+",
                label: "Sites Scanned",
                trend: "+28%",
              },
              {
                icon: TrendingUp,
                value: "180K+",
                label: "Vulnerabilities Found",
                trend: "Protected",
              },
              {
                icon: CheckCircle,
                value: "99.8%",
                label: "Accuracy Rate",
                trend: "Verified",
              },
              {
                icon: Shield,
                value: "24/7",
                label: "Monitoring",
                trend: "Real-time",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative group"
              >
                <div className="bg-background rounded-xl p-6 border hover:shadow-lg transition-shadow">
                  <stat.icon className="h-8 w-8 text-primary mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                  <div className="text-xs font-medium text-primary">{stat.trend}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
