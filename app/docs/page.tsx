"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, Search as SearchIcon, FileText, Video, Code, HelpCircle, Shield, Wrench } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type DocArticle = {
  id: string;
  title: string;
  category: string;
  content: string[];
  keywords?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function DocumentationPage() {
  const t = useTranslations("docs");
  const serviceGuides: DocArticle[] = [
    {
      id: "guide-service-hosting",
      title: "Hosting",
      category: "Services Guides",
      content: [
        "Choose a plan and initiate provisioning; connect your domain and set DNS records.",
        "Enable SSL, automatic backups, and server-level caching.",
        "Set up staging environment and deployment workflow (Git/CI) if needed."
      ],
    },
    {
      id: "guide-service-speed-optimization",
      title: "Speed Optimization",
      category: "Services Guides",
      content: [
        "Run an audit (PageSpeed Insights/Lighthouse) and prioritize LCP/CLS fixes.",
        "Configure caching, code minification, image optimization, and critical CSS.",
        "Verify improvements, then monitor Core Web Vitals over time."
      ],
    },
    {
      id: "guide-service-security",
      title: "Security Services",
      category: "Services Guides",
      content: [
        "Harden WordPress (disable file edit, limit login, enforce strong passwords).",
        "Enable WAF, malware scanning, and regular patching; configure alerts.",
        "Set backup/restore procedures and incident response playbook."
      ],
    },
    {
      id: "guide-service-seo",
      title: "SEO Services",
      category: "Services Guides",
      content: [
        "Perform technical audit (sitemaps, robots, schema, canonical, crawl budget).",
        "Optimize on-page meta, headings, internal links; fix 404s/redirects.",
        "Define content plan and track rankings and index coverage."
      ],
    },
    {
      id: "guide-service-maintenance",
      title: "Maintenance Plans",
      category: "Services Guides",
      content: [
        "Schedule weekly updates, uptime monitoring, and daily backups.",
        "Apply security patches and review logs; document changes.",
        "Provide monthly health reports and recommendations."
      ],
    },
    {
      id: "guide-service-themes",
      title: "Themes",
      category: "Services Guides",
      content: [
        "Select a base theme or design system; set up child theme.",
        "Implement responsive components and accessibility checks (WCAG).",
        "Performance-tune critical templates and test cross-browser."
      ],
    },
    {
      id: "guide-service-wp-scan",
      title: "WP Scan",
      category: "Services Guides",
      content: [
        "Connect target site; run initial vulnerability scan and permissions check.",
        "Review findings (plugins/themes/core); prioritize critical patches.",
        "Schedule recurring scans and export reports for stakeholders."
      ],
    },
  ];
  const pluginGuides: DocArticle[] = [
    { id: "guide-instant-image-optimizer", title: "Instant Image Optimizer", category: "Plugin Guides", content: [
      "Install and activate, then enable WebP/AVIF and lazy loading in Settings → Instant Image Optimizer.",
      "Run a bulk optimization and set preferred quality; verify Core Web Vitals improvements.",
      "Enable CDN (Pro+) and configure exclusions for logos or critical images if needed."
    ]},
    { id: "guide-instant-broken-link-fixer", title: "Instant Broken Link Fixer", category: "Plugin Guides", content: [
      "Start a full-site scan; review broken, redirected, and media links.",
      "Apply AI suggestions or create redirects; export a CSV for audit if required.",
      "Schedule automatic scans and email reports for continuous link health."
    ]},
    { id: "guide-instant-security-guard", title: "Instant Security Guard", category: "Plugin Guides", content: [
      "Enable firewall (WAF), malware scanning, and brute-force protection.",
      "Turn on 2FA/MFA for administrators; restrict XML-RPC and set rate limits.",
      "Schedule automated backups (Pro+) and verify restore on staging."
    ]},
    { id: "guide-instant-duplicator", title: "Instant Duplicator", category: "Plugin Guides", content: [
      "Duplicate posts/pages/products with one click; preserve taxonomies and meta.",
      "Use AI rewrite (Pro+) to generate unique variations and adjust titles/meta.",
      "Leverage templates and bulk operations for large content updates."
    ]},
    { id: "guide-instant-forms", title: "Instant Forms", category: "Plugin Guides", content: [
      "Create forms with the drag-and-drop builder; enable spam protection.",
      "Configure notifications, confirmations, and multi-step flows as needed.",
      "Connect to email/CRM integrations and track conversions."
    ]},
    { id: "guide-instant-seo", title: "Instant SEO", category: "Plugin Guides", content: [
      "Set global title/meta templates; enable XML sitemaps and schema markup.",
      "Optimize pages with on-page checks; track rankings where applicable.",
      "Fix broken links and add internal links to improve crawl efficiency."
    ]},
    { id: "guide-instant-backup", title: "Instant Backup", category: "Plugin Guides", content: [
      "Create your first full backup; choose cloud storage target.",
      "Schedule daily/weekly backups; enable retention policy.",
      "Test point-in-time restore on staging before production use."
    ]},
    { id: "guide-instant-cache", title: "Instant Cache", category: "Plugin Guides", content: [
      "Enable page/object caching; configure cache TTL and purge rules.",
      "Minify and defer non-critical assets; exclude admin and cart/checkout.",
      "Verify speed gains with PSI and disable conflicting cache plugins."
    ]},
    { id: "guide-instant-cart-recovery", title: "Instant Cart Recovery", category: "Plugin Guides", content: [
      "Connect WooCommerce; configure recovery emails/SMS and discount logic.",
      "Set exit-intent popups and segment audiences for better conversions.",
      "Monitor recovery rate and iterate on sequences."
    ]},
    { id: "guide-instant-ai-writer", title: "Instant AI Writer", category: "Plugin Guides", content: [
      "Generate headlines, outlines, and drafts directly in the editor.",
      "Use tone/length controls and SEO suggestions for optimization.",
      "Review for accuracy and add human edits before publishing."
    ]},
    { id: "guide-instant-review-booster", title: "Instant Review Booster", category: "Plugin Guides", content: [
      "Enable automated review requests post-purchase; pick templates.",
      "Embed review widgets with rich snippets on key pages.",
      "Analyze sentiment and showcase social proof."
    ]},
    { id: "guide-instant-popup-master", title: "Instant Popup Master", category: "Plugin Guides", content: [
      "Create targeted popups (exit-intent, scroll, delay) with A/B testing.",
      "Connect email providers and set device/page rules.",
      "Track conversions and iterate on copy and triggers."
    ]},
  ];
  const devResourcesArticles: DocArticle[] = [
    {
      id: "dev-wpscan-api",
      title: "WP Scan API",
      category: "Developer Resources",
      content: [
        "Authenticate requests and use endpoints to trigger scans, fetch results, and export reports.",
        "Rate-limit requests and validate payloads; handle webhooks for scan completion events.",
        "See the full reference under WP Scan API Docs.",
      ],
      keywords: "api wpscan webhooks endpoints auth",
    },
    {
      id: "dev-wpscan-stats",
      title: "WP Scan Statistics",
      category: "Developer Resources",
      content: [
        "Programmatically access aggregate vulnerability stats and historical trends.",
        "Filter by plugin/theme/core and time ranges for dashboards.",
        "Ideal for security reporting and monitoring.",
      ],
      keywords: "statistics analytics vulnerabilities trends",
    },
    {
      id: "dev-webhooks-events",
      title: "Webhooks & Events",
      category: "Developer Resources",
      content: [
        "Register webhook URLs to receive notifications for important lifecycle events.",
        "Verify signatures, implement retries, and log deliveries for observability.",
        "Use queues to decouple processing from delivery.",
      ],
      keywords: "webhooks events signatures retries",
    },
    {
      id: "dev-stripe-integration",
      title: "Stripe Integration",
      category: "Developer Resources",
      content: [
        "Use Checkout Sessions with webhooks for order fulfillment and subscription lifecycle.",
        "Store customer/product IDs securely; never expose secrets on the client.",
        "Test in sandbox, then rotate keys and enable alerts for production.",
      ],
      keywords: "stripe checkout subscriptions webhooks security",
    },
  ];
  const faqArticles: DocArticle[] = [
    {
      id: "faq-billing-licensing",
      title: "Billing & Licensing",
      category: "FAQs",
      content: [
        "Subscriptions renew annually unless canceled; invoices are emailed automatically.",
        "Licenses include updates/support during the term; renew to continue receiving updates.",
        "30-day money-back guarantee applies to first purchase.",
      ],
    },
    {
      id: "faq-account-management",
      title: "Account Management",
      category: "FAQs",
      content: [
        "Update profile and billing from your dashboard; enable 2FA for security.",
        "Regenerate API keys if compromised; rotate secrets regularly.",
        "Transfer licenses via support when needed.",
      ],
    },
    {
      id: "faq-upgrades-downgrades",
      title: "Upgrades & Downgrades",
      category: "FAQs",
      content: [
        "Upgrade anytime and pay prorated differences; downgrades apply next cycle.",
        "Switch between monthly/yearly where applicable; review add-ons before changes.",
        "Contact support for custom licensing needs.",
      ],
    },
    {
      id: "faq-technical-questions",
      title: "Technical Questions",
      category: "FAQs",
      content: [
        "Minimum requirements: WordPress 6.0+, PHP 8.0+, HTTPS enabled.",
        "Use staging for major changes; enable debug logs for troubleshooting.",
        "Open a ticket with environment details for faster resolution.",
      ],
    },
  ];
  const troubleshootingArticles: DocArticle[] = [
    {
      id: "troubleshoot-plugin-conflicts",
      title: "Plugin Conflicts",
      category: "Troubleshooting",
      content: [
        "Temporarily switch to a default theme and disable all other plugins.",
        "Re-enable one by one to find the conflict; check browser console and logs.",
        "Report reproducible steps and versions when opening a ticket.",
      ],
    },
    {
      id: "troubleshoot-performance",
      title: "Performance Issues",
      category: "Troubleshooting",
      content: [
        "Measure with PSI/Lighthouse; identify render-blocking assets and large payloads.",
        "Enable caching, minify assets, lazy load images, and reduce third-party scripts.",
        "Validate improvements and monitor Core Web Vitals.",
      ],
    },
    {
      id: "troubleshoot-errors",
      title: "Error Messages",
      category: "Troubleshooting",
      content: [
        "Enable WP_DEBUG_LOG and inspect server error logs for stack traces.",
        "Check API keys/permissions and recent changes or updates.",
        "Rollback to last known good backup if needed, then reapply changes incrementally.",
      ],
    },
    {
      id: "troubleshoot-updates-compat",
      title: "Updates & Compatibility",
      category: "Troubleshooting",
      content: [
        "Verify PHP/WordPress version compatibility and required extensions.",
        "Clear caches/CDN after updates; regenerate assets if applicable.",
        "Run on staging first and maintain a rollback plan.",
      ],
    },
  ];
  const videoTutorials: DocArticle[] = [
    {
      id: "video-getting-started-overview",
      title: "Getting Started Overview",
      category: "Video Tutorials",
      content: [
        "Overview of installation, license activation, and initial configuration.",
        "Key tips for staging, backups, and safe rollout.",
        "Next steps and where to find more docs.",
      ],
    },
    {
      id: "video-performance-tuning",
      title: "Performance Tuning",
      category: "Video Tutorials",
      content: [
        "Walkthrough of caching, minification, and image optimization.",
        "How to analyze PSI reports and address LCP/CLS.",
        "Iterating safely with measurements.",
      ],
    },
    {
      id: "video-security-basics",
      title: "Security Basics",
      category: "Video Tutorials",
      content: [
        "Enabling WAF/malware scanning and hardening best practices.",
        "Backups and incident response prep.",
        "User roles, least privilege, and 2FA.",
      ],
    },
    {
      id: "video-seo-essentials",
      title: "SEO Essentials",
      category: "Video Tutorials",
      content: [
        "Meta templates, sitemaps, schema, and internal linking.",
        "Fixing 404s/redirects and improving crawl.",
        "Tracking rankings and coverage.",
      ],
    },
  ];
  const gettingStartedArticles: DocArticle[] = [
    {
      id: "installation-guide",
      title: "Installation Guide",
      category: "Getting Started",
      content: [
        "From your WordPress Dashboard go to Plugins → Add New → Upload Plugin and select the downloaded ZIP file.",
        "Click Install Now then Activate. For manual install, upload to /wp-content/plugins/ and activate from Dashboard.",
        "Repeat for any additional Instant plugins you’ve purchased or wish to trial."
      ],
      keywords: "install upload plugin zip activate manual ftp"
    },
    {
      id: "quick-start",
      title: "Quick Start Tutorial",
      category: "Getting Started",
      content: [
        "After activation, open Settings → Instant and run the setup wizard.",
        "Enable recommended defaults, then verify key features work (caching, security, image optimization as applicable).",
        "Create a restore point or backup before making large changes on production."
      ],
      keywords: "quick start wizard setup defaults"
    },
    {
      id: "system-requirements",
      title: "System Requirements",
      category: "Getting Started",
      content: [
        "WordPress 6.0+ and PHP 8.0+ are recommended for best performance.",
        "Ensure REST API is enabled and your host allows outgoing HTTPS requests for license checks and updates.",
        "WooCommerce 7.0+ for commerce-related features."
      ],
      keywords: "requirements php wordpress woocommerce"
    },
    {
      id: "license-activation",
      title: "License Activation",
      category: "Getting Started",
      content: [
        "Go to Settings → Instant → Licensing and paste your license key.",
        "Click Activate; the status should show Active with expiry date.",
        "Licenses include updates and support for the subscription term."
      ],
      keywords: "license key activate updates support"
    }
  ];

  const popularArticlesData: DocArticle[] = [
    {
      id: "install-first-plugin",
      title: "How to Install Your First Plugin",
      category: "Popular",
      content: [
        "Navigate to Plugins → Add New and search for the Instant plugin you need or upload the ZIP from your account dashboard.",
        "Click Install, then Activate. Open the plugin settings to complete any onboarding steps.",
        "Test on a staging site first when possible, and clear any caches after activation."
      ],
      keywords: "first plugin install add new upload zip"
    },
    {
      id: "optimize-performance-instant-speed",
      title: "Optimizing WordPress Performance with Instant Speed",
      category: "Popular",
      content: [
        "Enable page and object caching, minify CSS/JS, and defer non-critical scripts.",
        "Use Instant Image Optimizer for WebP/AVIF conversion and lazy loading to reduce payload.",
        "Verify Core Web Vitals with PageSpeed Insights and iterate on LCP/CLS improvements."
      ],
      keywords: "performance cache minify webp avif lazy loading core web vitals"
    },
    {
      id: "security-setup-guide",
      title: "Complete Security Setup Guide",
      category: "Popular",
      content: [
        "Activate firewall, malware scanning, and login protection in Instant Security Guard.",
        "Enable 2FA/MFA for admin accounts, restrict XML-RPC, and set rate limiting.",
        "Schedule automated backups and verify restore works before an incident."
      ],
      keywords: "security waf malware 2fa backup"
    },
    {
      id: "seo-best-practices-instant-seo",
      title: "SEO Best Practices with Instant SEO",
      category: "Popular",
      content: [
        "Configure titles and meta descriptions, enable XML sitemaps and schema markup.",
        "Optimize content with on-page checks and fix broken links for crawl efficiency.",
        "Submit sitemaps to Google Search Console and monitor index coverage."
      ],
      keywords: "seo meta sitemap schema search console"
    },
    {
      id: "woocommerce-optimization",
      title: "WooCommerce Store Optimization",
      category: "Popular",
      content: [
        "Optimize product images (WebP/AVIF), enable fragment caching, and reduce blocking JS.",
        "Use Instant Cart Recovery, Instant Cache Pro, and security hardening for checkout.",
        "Measure conversion impacts after performance changes."
      ],
      keywords: "woocommerce optimize checkout cache images"
    }
  ];

  const articles = [
    ...gettingStartedArticles,
    ...popularArticlesData,
    ...pluginGuides,
    ...serviceGuides,
    ...devResourcesArticles,
    ...faqArticles,
    ...troubleshootingArticles,
    ...videoTutorials,
  ];

  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as DocArticle[];
    return articles
      .map((a) => ({
        ...a,
        score:
          (a.title.toLowerCase().includes(q) ? 5 : 0) +
          (a.category.toLowerCase().includes(q) ? 2 : 0) +
          (a.keywords?.includes(q) ? 2 : 0) +
          (a.content.some((p) => p.toLowerCase().includes(q)) ? 1 : 0),
      }))
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query, articles]);

  const categories = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Install, configure, and activate licenses for Instant plugins",
      articles: [
        ...gettingStartedArticles.map((a) => ({ label: a.title, href: `#${a.id}` })),
        { label: "More getting started", href: "#quick-start" },
      ],
    },
    {
      title: "Plugin Guides",
      icon: FileText,
      description: "Detailed guides for our flagship plugins",
      articles: [
        { label: "Instant Image Optimizer", href: "#guide-instant-image-optimizer" },
        { label: "Instant Broken Link Fixer", href: "#guide-instant-broken-link-fixer" },
        { label: "Instant Security Guard", href: "#guide-instant-security-guard" },
        { label: "Instant Duplicator", href: "#guide-instant-duplicator" },
        { label: "Instant Forms", href: "#guide-instant-forms" },
        { label: "Instant SEO", href: "#guide-instant-seo" },
        { label: "Instant Backup", href: "#guide-instant-backup" },
        { label: "Instant Cache", href: "#guide-instant-cache" },
        { label: "Instant Cart Recovery", href: "#guide-instant-cart-recovery" },
        { label: "Instant AI Writer", href: "#guide-instant-ai-writer" },
        { label: "Instant Review Booster", href: "#guide-instant-review-booster" },
        { label: "Instant Popup Master", href: "#guide-instant-popup-master" },
        { label: "More plugin guides", href: "/plugins" },
      ],
    },
    {
      title: "Services Guides",
      icon: Wrench,
      description: "Setup and onboarding for professional services",
      articles: [
        { label: "Hosting", href: "#guide-service-hosting" },
        { label: "Speed Optimization", href: "#guide-service-speed-optimization" },
        { label: "Security Services", href: "#guide-service-security" },
        { label: "SEO Services", href: "#guide-service-seo" },
        { label: "Maintenance Plans", href: "#guide-service-maintenance" },
        { label: "Themes", href: "#guide-service-themes" },
        { label: "WP Scan", href: "#guide-service-wp-scan" },
        { label: "More services", href: "/services/hosting" },
      ],
    },
    {
      title: "Developer Resources",
      icon: Code,
      description: "APIs and integration references",
      articles: [
        { label: "WP Scan API", href: "#dev-wpscan-api" },
        { label: "WP Scan Statistics", href: "#dev-wpscan-stats" },
        { label: "Webhooks & Events", href: "#dev-webhooks-events" },
        { label: "Stripe Integration", href: "#dev-stripe-integration" },
        { label: "More developer resources", href: "/wp-scan/api-docs" },
      ],
    },
    {
      title: "FAQs",
      icon: HelpCircle,
      description: "Common questions and answers",
      articles: [
        { label: "Billing & Licensing", href: "#faq-billing-licensing" },
        { label: "Account Management", href: "#faq-account-management" },
        { label: "Upgrades & Downgrades", href: "#faq-upgrades-downgrades" },
        { label: "Technical Questions", href: "#faq-technical-questions" },
        { label: "More FAQs", href: "/support" },
      ],
    },
    {
      title: "Troubleshooting",
      icon: Shield,
      description: "Solve common issues quickly",
      articles: [
        { label: "Plugin Conflicts", href: "#troubleshoot-plugin-conflicts" },
        { label: "Performance Issues", href: "#troubleshoot-performance" },
        { label: "Error Messages", href: "#troubleshoot-errors" },
        { label: "Updates & Compatibility", href: "#troubleshoot-updates-compat" },
        { label: "More troubleshooting", href: "/support" },
      ],
    },
    {
      title: "Video Tutorials",
      icon: Video,
      description: "Step-by-step walkthroughs",
      articles: [
        { label: "Getting Started Overview", href: "#video-getting-started-overview" },
        { label: "Performance Tuning", href: "#video-performance-tuning" },
        { label: "Security Basics", href: "#video-security-basics" },
        { label: "SEO Essentials", href: "#video-seo-essentials" },
        { label: "More tutorials", href: "/blog" },
      ],
    },
  ];

  const popularArticles = popularArticlesData.map((a) => ({ title: a.title, href: `#${a.id}` }));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("pageTitle")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("heroSubtitle")}</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              className="pl-12 py-6 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {results.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-card border rounded-md shadow-sm text-left">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`#${r.id}`}
                    className="block px-4 py-2 hover:bg-secondary"
                  >
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.category}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t("popularArticles")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article) => (
              <Card key={article.href} className="hover:shadow-lg transition-shadow">
                <Link href={article.href} className="block">
                  <CardHeader>
                    <CardTitle className="text-base">{article.title}</CardTitle>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Documentation Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t("browseByCategory")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article, idx) => (
                        <li key={idx}>
                          <Link
                            href={article.href}
                            className="text-sm hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {article.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Getting Started - Content (completed first as requested) */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">{t("gettingStarted")}</h2>
          {gettingStartedArticles.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Popular Articles - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">{t("inDepthGuides")}</h2>
          {popularArticlesData.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Plugin Guides - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">{t("pluginGuides")}</h2>
          {pluginGuides.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <Link href={`/plugins/${a.title.toLowerCase().replaceAll(" ", "-")}`}>View product page →</Link>
              </div>
            </section>
          ))}
        </div>

        {/* Services Guides - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">{t("servicesGuides")}</h2>
          {serviceGuides.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <Link href={a.title === "WP Scan" ? "/wp-scan" : `/services/${a.title.toLowerCase().replaceAll(" ", "-")}`}>
                  View service page →
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* Developer Resources - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">Developer Resources</h2>
          {devResourcesArticles.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <Link href={a.id === "dev-wpscan-api" ? "/wp-scan/api-docs" : a.id === "dev-wpscan-stats" ? "/wp-scan/statistics" : "/docs"}>
                  View docs →
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* FAQs - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">FAQs</h2>
          {faqArticles.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Troubleshooting - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">Troubleshooting</h2>
          {troubleshootingArticles.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Video Tutorials - Full Content */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold">Video Tutorials</h2>
          {videoTutorials.map((a) => (
            <section key={a.id} id={a.id} className="scroll-mt-24">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <div className="space-y-2 text-muted-foreground">
                {a.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>{t("ctaTitle")}</CardTitle>
              <CardDescription>{t("ctaSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/support">{t("contactSupport")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">{t("sendFeedback")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
