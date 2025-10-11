"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CookieSettingsLink } from "@/components/cookie-consent/cookie-settings-link";
// import { useTranslations } from "next-intl"; // DISABLED

// Temporary fallback translations
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    tagline: "Premium WordPress plugins built for success. Transform your website with professional features, exceptional support, and regular updates.",
    description: "Transform your WordPress site with our premium plugins and services. Professional features, exceptional support, and regular updates.",
    products: "Products",
    services: "Services",
    resources: "Resources",
    company: "Company",
    allPlugins: "All Plugins",
    seoTools: "SEO Tools",
    ecommerce: "E-Commerce",
    security: "Security",
    pricing: "Pricing",
    wpScan: "WP Scan",
    maintenancePlans: "Maintenance Plans",
    speedOptimization: "Speed Optimization",
    securityServices: "Security Services",
    seoServices: "SEO Services",
    managedHosting: "Managed Hosting",
    customThemes: "Custom Themes",
    documentation: "Documentation",
    blog: "Blog",
    support: "Support",
    changelog: "Changelog",
    roadmap: "Roadmap",
    api: "API",
    aboutUs: "About Us",
    contact: "Contact",
    careers: "Careers",
    partners: "Partners",
    affiliates: "Affiliates",
    copyright: "© 2025 Instant. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    refund: "Refund Policy",
    trustedPayments: "Trusted Payment Methods:",
    sslSecured: "SSL Secured",
    gdprCompliant: "GDPR Compliant",
    pciDss: "PCI DSS Level 1",
    uptime: "99.9% Uptime",
    moneyBack: "Money Back Guarantee",
    support247: "24/7 Support",
  };
  return translations[key] || key;
};

export function Footer() {
  const t = mockT; // Use mock translations
  return (
    <footer className="border-t bg-secondary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="Instant" width={120} height={32} className="h-8 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {t("tagline")}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("products")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/plugins" className="text-muted-foreground hover:text-foreground transition-colors">{t("allPlugins")}</Link></li>
              <li><Link href="/plugins?category=seo" className="text-muted-foreground hover:text-foreground transition-colors">{t("seoTools")}</Link></li>
              <li><Link href="/plugins?category=ecommerce" className="text-muted-foreground hover:text-foreground transition-colors">{t("ecommerce")}</Link></li>
              <li><Link href="/plugins?category=security" className="text-muted-foreground hover:text-foreground transition-colors">{t("security")}</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">{t("pricing")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("services")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/wp-scan" className="text-muted-foreground hover:text-foreground transition-colors">{t("wpScan")}</Link></li>
              <li><Link href="/services/maintenance" className="text-muted-foreground hover:text-foreground transition-colors">{t("maintenancePlans")}</Link></li>
              <li><Link href="/services/speed-optimization" className="text-muted-foreground hover:text-foreground transition-colors">{t("speedOptimization")}</Link></li>
              <li><Link href="/services/security" className="text-muted-foreground hover:text-foreground transition-colors">{t("securityServices")}</Link></li>
              <li><Link href="/services/seo" className="text-muted-foreground hover:text-foreground transition-colors">{t("seoServices")}</Link></li>
              <li><Link href="/services/hosting" className="text-muted-foreground hover:text-foreground transition-colors">{t("managedHosting")}</Link></li>
              <li><Link href="/services/themes" className="text-muted-foreground hover:text-foreground transition-colors">{t("customThemes")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">{t("documentation")}</Link></li>
              <li><a href="https://blog.instant.tw" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">{t("blog")}</a></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">{t("support")}</Link></li>
              <li><Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">{t("changelog")}</Link></li>
              <li><Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">{t("roadmap")}</Link></li>
              <li><Link href="/wp-scan/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">{t("api")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("company")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">{t("contact")}</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">{t("careers")}</Link></li>
              <li><Link href="/partners" className="text-muted-foreground hover:text-foreground transition-colors">{t("partners")}</Link></li>
              <li><Link href="/affiliates" className="text-muted-foreground hover:text-foreground transition-colors">{t("affiliates")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{t("copyright")}</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">{t("privacy")}</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">{t("terms")}</Link>
              <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Refund Policy
              </Link>
              <CookieSettingsLink />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center items-center">
            <p className="text-xs text-muted-foreground">{t("trustedPayments")}</p>
            <div className="flex gap-3 items-center">
              <div className="h-8 px-3 rounded border bg-background flex items-center text-xs font-medium">VISA</div>
              <div className="h-8 px-3 rounded border bg-background flex items-center text-xs font-medium">Mastercard</div>
              <div className="h-8 px-3 rounded border bg-background flex items-center text-xs font-medium">PayPal</div>
              <div className="h-8 px-3 rounded border bg-background flex items-center text-xs font-medium">Stripe</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 border-t pt-8">
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs font-medium">{t("sslSecured")}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs font-medium">{t("gdprCompliant")}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium">{t("pciDss")}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-medium">{t("uptime")}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium">{t("moneyBack")}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
                <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-xs font-medium">{t("support247")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
