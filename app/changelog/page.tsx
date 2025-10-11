import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Bug, Zap, Star, Shield } from "lucide-react";

export default function ChangelogPage() {
  const releases = [
    {
      version: "2.5.0",
      date: "January 15, 2025",
      type: "Major Release",
      badge: "Latest",
      changes: [
        { type: "feature", icon: Star, text: "Added AI-powered content optimization for Instant SEO" },
        { type: "feature", icon: Zap, text: "New WebP and AVIF image conversion in Instant Speed Optimizer" },
        { type: "feature", icon: Shield, text: "Enhanced malware detection in Instant Security Guard" },
        { type: "improvement", icon: Zap, text: "Improved database optimization algorithms" },
        { type: "improvement", icon: Package, text: "Better WooCommerce integration" },
        { type: "fix", icon: Bug, text: "Fixed cache clearing issue on multisite installations" }
      ]
    },
    {
      version: "2.4.2",
      date: "January 5, 2025",
      type: "Patch",
      changes: [
        { type: "fix", icon: Bug, text: "Resolved conflict with WordPress 6.4.2" },
        { type: "fix", icon: Bug, text: "Fixed uptime monitoring notification delays" },
        { type: "improvement", icon: Zap, text: "Performance improvements for large databases" }
      ]
    },
    {
      version: "2.4.0",
      date: "December 20, 2024",
      type: "Minor Release",
      changes: [
        { type: "feature", icon: Star, text: "Introduced Instant Broken Link Fixer plugin" },
        { type: "feature", icon: Shield, text: "Two-factor authentication for admin accounts" },
        { type: "improvement", icon: Zap, text: "Faster backup processing with incremental backups" },
        { type: "improvement", icon: Package, text: "Enhanced compatibility with PHP 8.2" },
        { type: "fix", icon: Bug, text: "Fixed SSL certificate verification issues" }
      ]
    },
    {
      version: "2.3.1",
      date: "December 10, 2024",
      type: "Patch",
      changes: [
        { type: "fix", icon: Bug, text: "Fixed critical security vulnerability in file upload" },
        { type: "fix", icon: Bug, text: "Resolved caching issues with dynamic content" },
        { type: "improvement", icon: Zap, text: "Improved error logging and debugging" }
      ]
    },
    {
      version: "2.3.0",
      date: "November 25, 2024",
      type: "Minor Release",
      changes: [
        { type: "feature", icon: Star, text: "Added Content Protector plugin" },
        { type: "feature", icon: Zap, text: "New CDN integration for Instant Cache" },
        { type: "improvement", icon: Package, text: "Better mobile responsive detection" },
        { type: "improvement", icon: Zap, text: "Optimized JavaScript minification" },
        { type: "fix", icon: Bug, text: "Fixed timezone issues in scheduled backups" }
      ]
    },
    {
      version: "2.2.0",
      date: "November 10, 2024",
      type: "Major Release",
      changes: [
        { type: "feature", icon: Star, text: "Launched Uptime Monitor plugin" },
        { type: "feature", icon: Shield, text: "Advanced firewall rules engine" },
        { type: "feature", icon: Zap, text: "Real-time performance monitoring dashboard" },
        { type: "improvement", icon: Package, text: "Redesigned user interface across all plugins" },
        { type: "fix", icon: Bug, text: "Multiple bug fixes and stability improvements" }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "text-green-500";
      case "improvement":
        return "text-blue-500";
      case "fix":
        return "text-orange-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Changelog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track all updates, new features, improvements, and bug fixes across our plugin suite
          </p>
        </div>

        {/* Legend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-green-500" />
                <span className="text-sm">New Feature</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Bug Fix</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changelog Timeline */}
        <div className="space-y-8">
          {releases.map((release, index) => (
            <Card key={index} className={index === 0 ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">v{release.version}</CardTitle>
                      {release.badge && (
                        <Badge className="bg-primary">{release.badge}</Badge>
                      )}
                      <Badge variant="outline">{release.type}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {release.date}
                    </CardDescription>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {release.changes.map((change, idx) => {
                    const Icon = change.icon;
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getTypeColor(change.type)}`} />
                        <span className="text-sm">{change.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <Card className="mt-12 bg-secondary/30">
          <CardHeader className="text-center">
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>
              Subscribe to our newsletter to get notified about new releases and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border rounded-md"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
