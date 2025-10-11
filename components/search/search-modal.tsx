"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ArrowRight, TrendingUp, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { allPlugins } from "@/config/plugins-data";
// import { useTranslations } from "next-intl"; // DISABLED

// Mock translations
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    placeholder: "Search plugins, docs, and more...",
    noResults: "No results found",
    plugins: "Plugins",
    docs: "Documentation",
    services: "Services",
  };
  return translations[key] || key;
};

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
  keywords?: string;
  relevance?: number;
}

// Build comprehensive search index from all content sources
const buildSearchIndex = (): SearchResult[] => {
  const index: SearchResult[] = [];
  
  // Main Pages
  index.push(
    { title: "Home", description: "Premium WordPress plugins and services for professionals", url: "/", category: "Pages", keywords: "home homepage main landing" },
    { title: "Plugins", description: "Browse our collection of premium WordPress plugins", url: "/plugins", category: "Pages", keywords: "plugins extensions catalog browse" },
    { title: "Pricing", description: "Flexible pricing plans for every need - Pro, Agency, Enterprise", url: "/pricing", category: "Pages", keywords: "pricing plans cost price billing" },
    { title: "About Us", description: "Learn more about Instant and our mission", url: "/about", category: "Pages", keywords: "about company mission team" },
    { title: "Contact", description: "Get in touch with our support team", url: "/contact", category: "Pages", keywords: "contact support help email" },
    { title: "Support", description: "Get help and find answers to your questions", url: "/support", category: "Pages", keywords: "support help faq questions" }
  );
  
  // All 12 Plugins from plugins-data.ts with comprehensive details
  allPlugins.forEach(plugin => {
    // Create searchable keywords from plugin features
    const features = plugin.pricing.pro?.features?.join(" ") || "";
    const agencyFeatures = plugin.pricing.agency?.features?.join(" ") || "";
    
    index.push({
      title: plugin.name,
      description: plugin.description,
      url: `/plugins/${plugin.slug}`,
      category: "Plugin",
      keywords: `${plugin.name} ${plugin.tagline} ${plugin.category} ${features} ${agencyFeatures} ${plugin.slug}`.toLowerCase()
    });
  });
  
  // Services (from services-overview.tsx)
  index.push(
    {
      title: "WordPress Hosting",
      description: "Premium WordPress hosting optimized for speed, security, and reliability. Powerful hosting infrastructure with daily backups and 99.9% uptime guarantee.",
      url: "/services/hosting",
      category: "Service",
      keywords: "hosting managed wordpress host vps server cloud infrastructure uptime backup performance"
    },
    {
      title: "WP Scan",
      description: "Scan your WordPress site for vulnerabilities, outdated plugins, and security issues with our advanced scanner. Identify threats before they become problems.",
      url: "/wp-scan",
      category: "Service",
      keywords: "wpscan scan security vulnerability malware scanner check test audit vulnerabilities threats"
    },
    {
      title: "Maintenance Plans",
      description: "Complete WordPress maintenance including updates, backups, monitoring, and support. Focus on your business while we handle your site maintenance.",
      url: "/services/maintenance",
      category: "Service",
      keywords: "maintenance support updates backups monitoring care plans managed service"
    },
    {
      title: "Speed Optimization",
      description: "Make your WordPress site lightning fast with professional optimization. Improve load times, boost SEO, and increase conversions with expert speed tuning.",
      url: "/services/speed-optimization",
      category: "Service",
      keywords: "speed performance optimization fast loading cache caching cdn minify compress accelerate"
    },
    {
      title: "Security Services",
      description: "Comprehensive WordPress security including malware scanning, firewall protection, security hardening, and 24/7 monitoring to protect your site.",
      url: "/services/security",
      category: "Service",
      keywords: "security protection firewall malware hardening monitoring ssl hack prevention secure"
    },
    {
      title: "SEO Services",
      description: "Rank higher on Google with professional WordPress SEO. Technical optimization, content strategy, and link building to improve search rankings.",
      url: "/services/seo",
      category: "Service",
      keywords: "seo search engine optimization ranking google keywords content links schema"
    },
    {
      title: "WordPress Themes",
      description: "Professional themes for your WordPress site with custom design and development",
      url: "/services/themes",
      category: "Service",
      keywords: "themes design template customization development custom"
    }
  );
  
  // WP Scan Pages
  index.push(
    { title: "WP Scan API Documentation", description: "Complete API documentation for WP Scan service integration", url: "/wp-scan/api-docs", category: "Documentation", keywords: "api documentation docs integration developer" },
    { title: "WP Scan Statistics", description: "View comprehensive security statistics and vulnerability trends", url: "/wp-scan/statistics", category: "Documentation", keywords: "statistics stats data analytics trends reports" }
  );
  
  // Programs & Company
  index.push(
    { title: "Affiliates Program", description: "Earn 30% recurring commission by promoting our premium plugins and services", url: "/affiliates", category: "Programs", keywords: "affiliates partners commission referral earn money promote" },
    { title: "Partners", description: "Partner with us and grow together. Join our partnership program", url: "/partners", category: "Programs", keywords: "partners partnership collaborate integration agency" },
    { title: "Careers", description: "Join our team and build amazing WordPress products. 6 open positions", url: "/careers", category: "Company", keywords: "careers jobs hiring employment work opportunities" }
  );
  
  // Resources
  index.push(
    { title: "Changelog", description: "Latest updates, improvements, and version history", url: "/changelog", category: "Resources", keywords: "changelog updates versions history changes releases" },
    { title: "Roadmap", description: "See what we're building next and upcoming features", url: "/roadmap", category: "Resources", keywords: "roadmap future upcoming planned features development" },
    { title: "Blog", description: "WordPress tips, tutorials, news, and best practices", url: "/blog", category: "Resources", keywords: "blog articles posts tutorials tips guides news" },
    { title: "Documentation", description: "Complete guides and documentation for our products", url: "/docs", category: "Resources", keywords: "documentation docs guides manuals help instructions" }
  );
  
  // Legal
  index.push(
    { title: "Privacy Policy", description: "How we handle your data and privacy - GDPR & CCPA compliant", url: "/privacy", category: "Legal", keywords: "privacy policy gdpr ccpa data protection" },
    { title: "Terms of Service", description: "Terms and conditions of using our services and plugins", url: "/terms", category: "Legal", keywords: "terms service conditions agreement legal" },
    { title: "Refund Policy", description: "Our 30-day money-back guarantee and refund policy", url: "/refund-policy", category: "Legal", keywords: "refund policy guarantee money back cancellation" }
  );
  
  return index;
};

const searchableContent: SearchResult[] = buildSearchIndex();

// Popular search keywords (based on actual content)
const popularKeywords = [
  "security",
  "optimization",
  "backup",
  "seo",
  "cache",
  "image optimizer",
  "broken links",
  "uptime",
  "hosting",
  "maintenance",
  "speed",
  "woocommerce",
];

// Quick links to popular pages
const quickLinks = [
  { title: "Browse Plugins", url: "/plugins", icon: "🔌" },
  { title: "View Pricing", url: "/pricing", icon: "💰" },
  { title: "WP Scan Service", url: "/wp-scan", icon: "🔍" },
  { title: "Hosting Plans", url: "/services/hosting", icon: "🚀" },
  { title: "Speed Optimization", url: "/services/speed-optimization", icon: "⚡" },
  { title: "Security Services", url: "/services/security", icon: "🔒" },
  { title: "Contact Support", url: "/contact", icon: "💬" },
  { title: "Documentation", url: "/docs", icon: "📚" },
];

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState(0);
  const t = mockT; // Use mock translations

  // Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedResult(0);
    }
  }, [open]);

  // Advanced search with partial matching and relevance scoring
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const results = searchableContent
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        const categoryLower = item.category.toLowerCase();
        const keywordsLower = item.keywords?.toLowerCase() || "";
        
        let relevance = 0;
        
        // Exact title match (highest priority)
        if (titleLower === query) {
          relevance += 100;
        }
        // Title starts with query
        else if (titleLower.startsWith(query)) {
          relevance += 50;
        }
        // Title contains query
        else if (titleLower.includes(query)) {
          relevance += 30;
        }
        
        // Category match (high priority)
        if (categoryLower === query) {
          relevance += 40;
        } else if (categoryLower.includes(query)) {
          relevance += 20;
        }
        
        // Description contains query
        if (descLower.includes(query)) {
          relevance += 15;
        }
        
        // Keywords match (supports partial matching)
        if (keywordsLower.includes(query)) {
          relevance += 25;
        }
        
        // Partial word matching in keywords (e.g., "auth" matches "authentication")
        const keywords = keywordsLower.split(" ");
        keywords.forEach(keyword => {
          if (keyword.includes(query) || query.includes(keyword)) {
            relevance += 10;
          }
        });
        
        // Word boundary matching (e.g., "image" matches "Image Optimizer")
        const titleWords = titleLower.split(" ");
        titleWords.forEach(word => {
          if (word.startsWith(query)) {
            relevance += 20;
          }
        });
        
        return { ...item, relevance };
      })
      .filter((item) => item.relevance > 0) // Only return items with matches
      .sort((a, b) => b.relevance - a.relevance) // Sort by relevance
      .slice(0, 12); // Show up to 12 results

    return results;
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedResult((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedResult((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && searchResults[selectedResult]) {
        e.preventDefault();
        window.location.href = searchResults[selectedResult].url;
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, searchResults, selectedResult, onOpenChange]);

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const handleResultClick = (url: string) => {
    onOpenChange(false);
    // Small delay to allow modal to close before navigation
    setTimeout(() => {
      window.location.href = url;
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 focus:border-primary"
              autoFocus
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              {t("resultsFound", { count: searchResults.length })}
            </p>
          )}
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          {/* Search Results */}
          {searchQuery && (
            <div className="p-6 border-b flex-shrink-0">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                {t("results")}
              </h3>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.url}
                      onClick={() => handleResultClick(result.url)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        index === selectedResult
                          ? "bg-primary/10 border-primary"
                          : "bg-card hover:bg-secondary border-transparent"
                      }`}
                      onMouseEnter={() => setSelectedResult(index)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{result.title}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t("noResults", { query: searchQuery })}</p>
                </div>
              )}
            </div>
          )}

          {/* Two Column Layout - Popular Keywords & Quick Links */}
          <div className="grid md:grid-cols-2 gap-6 p-6 pb-4">
            {/* Left Column - Popular Keywords */}
            <div className="min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                  {t("popularSearches")}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordClick(keyword)}
                    className="px-3 py-1.5 text-sm bg-secondary hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Quick Links */}
            <div className="min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                  {t("quickLinks")}
                </h3>
              </div>
              <div className="space-y-1.5 pb-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors group"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {link.title}
                    </span>
                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t bg-secondary/50 flex-shrink-0">
          <p className="text-xs text-center text-muted-foreground">
            <kbd className="px-2 py-1 bg-background rounded border text-xs">↑</kbd>
            {" "}
            <kbd className="px-2 py-1 bg-background rounded border text-xs">↓</kbd>
            {" "}{t("navigateHint")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
