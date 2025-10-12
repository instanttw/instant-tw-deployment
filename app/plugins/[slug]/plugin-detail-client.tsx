"use client";

import { Plugin } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Download, Check, ShoppingCart, Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { generateProductSchema } from "@/lib/structured-data";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/currency-context";
import { UnifiedCheckoutButton } from "@/components/UnifiedCheckoutButton";
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PluginDetailClientProps {
  plugin: Plugin;
}

export function PluginDetailClient({ plugin }: PluginDetailClientProps) {
  const schema = generateProductSchema(plugin);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isDownloading, setIsDownloading] = useState(false);
  const { formatPrice } = useCurrency();

  // Handle auto-download for specific plugins
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (plugin.slug === 'instant-duplicator') {
      setIsDownloading(true);
      
      try {
        // Create a temporary link for download
        const link = document.createElement('a');
        link.href = plugin.freeDownloadUrl || '#';
        link.download = 'instant-duplicator.zip';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Optional: Track download event
        console.log('Instant Duplicator download initiated');
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback: open in new tab
        window.open(plugin.freeDownloadUrl, '_blank');
      } finally {
        setIsDownloading(false);
      }
    } else {
      // For other plugins, use default behavior
      window.open(plugin.freeDownloadUrl, '_blank');
    }
  };

  const tiers = [
    { key: "free", name: "Free", data: plugin.pricing.free },
    { key: "pro", name: "Pro", data: plugin.pricing.pro },
    { key: "agency", name: "Agency", data: plugin.pricing.agency },
    { key: "enterprise", name: "Enterprise", data: plugin.pricing.enterprise },
  ].filter((tier) => tier.data !== undefined);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Plugins', url: '/plugins' },
    { name: plugin.name, url: `/plugins/${plugin.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="min-h-screen">
      <div className="bg-secondary/30 py-12 mb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/plugins" className="hover:text-foreground transition-colors">
              Plugins
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{plugin.name}</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl flex-shrink-0">
                  {plugin.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{plugin.category}</Badge>
                    {plugin.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{plugin.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{plugin.tagline}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(plugin.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{plugin.rating}</span>
                      <span className="text-muted-foreground">
                        ({formatNumber(plugin.totalReviews)} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Download className="h-5 w-5" />
                      <span>{formatNumber(plugin.installations)} active installations</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">About This Plugin</h2>
                <p className="text-muted-foreground leading-relaxed">{plugin.description}</p>
                
                {/* Competitor Comparison Section */}
                {plugin.slug === 'instant-seo' && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Why Choose Instant SEO Over Yoast SEO or Rank Math?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>AI-Powered Optimization:</strong> Unlike Yoast SEO, we use AI to analyze and optimize your content automatically</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Built-in Rank Tracking:</strong> Track keyword rankings without needing external tools (not available in Yoast or Rank Math free versions)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Better Performance:</strong> Lighter and faster than Yoast SEO Premium with all features included</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {plugin.slug === 'instant-cache' && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Why Choose Instant Cache Over WP Rocket?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Better Value:</strong> All WP Rocket features at a lower price with more optimization options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Advanced Database Optimization:</strong> More comprehensive than WP Rocket's basic cleanup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Free Version Available:</strong> Try core features free (WP Rocket has no free version)</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {plugin.slug === 'instant-forms' && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Why Choose Instant Forms Over Contact Form 7 or WPForms?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Better Than Contact Form 7:</strong> Modern drag-and-drop builder (CF7 requires shortcodes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>More Features Than WPForms:</strong> Built-in spam protection, conditional logic, and multi-page forms in free version</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>AI Form Builder:</strong> Generate complete forms from descriptions (unique feature)</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {plugin.slug === 'instant-security-guard' && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Why Choose Instant Security Over Wordfence or Sucuri?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>AI Threat Detection:</strong> Advanced AI identifies threats Wordfence misses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Better Performance:</strong> Lighter than Wordfence (no slow background scans)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>More Affordable:</strong> Enterprise features at fraction of Sucuri's cost</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {plugin.slug === 'instant-backup' && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Why Choose Instant Backup Over UpdraftPlus or BackupBuddy?</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Faster Backups:</strong> Incremental backups are faster than UpdraftPlus full backups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>More Storage Options:</strong> Free cloud storage included (UpdraftPlus charges extra)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Better Value:</strong> All BackupBuddy features at lower price</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Download Free Button - Always shown if freeDownloadUrl exists */}
                  {plugin.freeDownloadUrl && (
                    <Button 
                      className="w-full" 
                      size="lg"
                      variant="outline"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading && plugin.slug === 'instant-duplicator' ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download Free
                        </>
                      )}
                    </Button>
                  )}
                  {/* Buy Pro Button - Shown if Pro pricing exists */}
                  {plugin.pricing.pro && (
                    <UnifiedCheckoutButton
                      productSlug={plugin.slug}
                      tierName="pro-yearly"
                      className="w-full"
                      size="lg"
                      variant="default"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Pro - {formatPrice(plugin.pricing.pro.price)}/year
                    </UnifiedCheckoutButton>
                  )}
                  <div className="pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">WordPress Version:</span>
                      <span className="font-medium">{plugin.compatibility.wordpress}</span>
                    </div>
                    {plugin.compatibility.woocommerce && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">WooCommerce:</span>
                        <span className="font-medium">{plugin.compatibility.woocommerce}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
        
        <p className="text-center text-muted-foreground mb-8">
          Annual pricing - One payment per year for updates and support
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier) => {
            const isPopular = tier.key === "pro";
            return (
              <motion.div
                key={tier.key}
                whileHover={{ scale: 1.02 }}
                className={`relative ${isPopular ? "lg:-mt-4" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <Card className={`h-full ${isPopular ? "border-primary shadow-lg" : ""}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      {tier.data!.price === 0 ? (
                        <div className="text-4xl font-bold">Free</div>
                      ) : (
                        <div>
                          <div className="text-4xl font-bold">
                            {formatPrice(tier.data!.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            /year
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    {tier.data!.price === 0 ? (
                      <Button
                        className="w-full h-11 mb-4"
                        variant="outline"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading && plugin.slug === 'instant-duplicator' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          "Download Free"
                        )}
                      </Button>
                    ) : (
                      <UnifiedCheckoutButton
                        productSlug={plugin.slug}
                        tierName={`${tier.key}-yearly`}
                        className="w-full h-11 mb-4"
                        variant={isPopular ? "default" : "outline"}
                      >
                        Get Started
                      </UnifiedCheckoutButton>
                    )}
                    <ul className="space-y-3 flex-1">
                      {tier.data!.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I install the plugin?</AccordionTrigger>
              <AccordionContent>
                You can install the plugin directly from your WordPress dashboard by going to
                Plugins → Add New, searching for &quot;{plugin.name}&quot;, and clicking Install. Alternatively,
                download the plugin and upload it via FTP to your /wp-content/plugins/ directory.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
              <AccordionContent>
                Yes! We offer a 30-day money-back guarantee. If you&apos;re not satisfied with the plugin,
                contact our support team within 30 days of purchase for a full refund.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I upgrade or downgrade my plan?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can upgrade or downgrade your plan at any time from your account
                dashboard. When upgrading, you&apos;ll only pay the prorated difference.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What kind of support do you provide?</AccordionTrigger>
              <AccordionContent>
                We provide email support for all plans with average response time under 24 hours.
                Pro and Agency plans get priority support with response times under 2 hours during
                business hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Are updates included?</AccordionTrigger>
              <AccordionContent>
                Yes! All plans include free updates for the duration of your subscription. We
                regularly release updates with new features, improvements, and security patches.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Easy Installation & Setup",
              "Regular Updates & Security Patches",
              "Premium Support Included",
              "Fully Customizable",
              "Mobile Responsive",
              "Performance Optimized",
              "SEO Friendly",
              "Multi-language Support",
              "Developer Documentation",
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-medium">{feature}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Dashboard Overview",
                description: "Clean and intuitive admin interface",
              },
              {
                title: "Settings Panel",
                description: "Comprehensive configuration options",
              },
              {
                title: "Frontend Display",
                description: "Beautiful user-facing design",
              },
              {
                title: "Mobile View",
                description: "Fully responsive across all devices",
              },
            ].map((screenshot, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <div className="aspect-video bg-secondary/30 flex items-center justify-center rounded-t-lg">
                    <div className="text-4xl font-bold text-muted-foreground opacity-20">
                      {plugin.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{screenshot.title}</h3>
                    <p className="text-sm text-muted-foreground">{screenshot.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Integrations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "WordPress",
              "WooCommerce",
              "Elementor",
              "Gutenberg",
              "PayPal",
              "Stripe",
              "Mailchimp",
              "Google Analytics",
              "Yoast SEO",
              "Contact Form 7",
              "WPForms",
              "Jetpack",
            ].map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
                  <div className="font-medium text-sm">{integration}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "John Doe",
                company: "Tech Startup",
                content: "This plugin saved us countless hours. The features are exactly what we needed.",
                rating: 5,
              },
              {
                name: "Jane Smith",
                company: "E-commerce Store",
                content: "Outstanding support and regular updates. Highly recommended!",
                rating: 5,
              },
              {
                name: "Mike Johnson",
                company: "Marketing Agency",
                content: "Best plugin in its category. Our clients love it.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">&quot;{testimonial.content}&quot;</p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
