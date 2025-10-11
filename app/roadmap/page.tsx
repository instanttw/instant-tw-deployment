import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage() {
  const roadmapItems = [
    {
      status: "in-progress",
      quarter: "Q1 2025",
      items: [
        {
          title: "AI-Powered SEO Suggestions",
          description: "Automatic content optimization recommendations using artificial intelligence",
          plugin: "Instant SEO",
          votes: 342
        },
        {
          title: "Real-time Collaboration Features",
          description: "Allow multiple team members to work on content simultaneously",
          plugin: "Instant Duplicator",
          votes: 287
        },
        {
          title: "Advanced Analytics Dashboard",
          description: "Comprehensive analytics and reporting across all plugins",
          plugin: "Platform",
          votes: 521
        }
      ]
    },
    {
      status: "planned",
      quarter: "Q2 2025",
      items: [
        {
          title: "Mobile App for Monitoring",
          description: "iOS and Android app for site monitoring and management",
          plugin: "Uptime Monitor",
          votes: 456
        },
        {
          title: "Video Compression & Optimization",
          description: "Automatic video optimization for faster page loads",
          plugin: "Instant Speed Optimizer",
          votes: 398
        },
        {
          title: "Multi-language Support",
          description: "Built-in support for translating plugin interfaces",
          plugin: "All Plugins",
          votes: 612
        },
        {
          title: "Advanced Caching Strategies",
          description: "Object caching, edge caching, and intelligent cache invalidation",
          plugin: "Instant Cache",
          votes: 334
        }
      ]
    },
    {
      status: "planned",
      quarter: "Q3 2025",
      items: [
        {
          title: "WooCommerce Product Recommendations",
          description: "AI-powered product suggestions to increase sales",
          plugin: "Instant Woo",
          votes: 445
        },
        {
          title: "Automated Image Alt Text Generator",
          description: "AI-generated alt text for better accessibility and SEO",
          plugin: "Instant SEO",
          votes: 289
        },
        {
          title: "Site Health Monitoring",
          description: "Proactive monitoring of site health and performance metrics",
          plugin: "Uptime Monitor",
          votes: 367
        }
      ]
    },
    {
      status: "completed",
      quarter: "Completed Recently",
      items: [
        {
          title: "Broken Link Fixer",
          description: "Automatically detect and fix broken links",
          plugin: "Instant Broken Link Fixer",
          votes: 534
        },
        {
          title: "Content Protection Suite",
          description: "Prevent content theft and unauthorized copying",
          plugin: "Instant Content Protector",
          votes: 423
        },
        {
          title: "Database Optimization Tools",
          description: "Clean and optimize database for better performance",
          plugin: "Instant Database Optimizer",
          votes: 589
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "planned":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Product Roadmap
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what we're working on and what's coming next. Vote on features you'd like to see!
          </p>
        </div>

        {/* Legend */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Planned</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Timeline */}
        <div className="space-y-8">
          {roadmapItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(section.status)}
                <h2 className="text-2xl font-bold">{section.quarter}</h2>
                {getStatusBadge(section.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                {section.items.map((item, itemIndex) => (
                  <Card key={itemIndex} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg pr-4">{item.title}</CardTitle>
                        <Badge variant="secondary" className="flex-shrink-0">
                          {item.plugin}
                        </Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lightbulb className="h-4 w-4" />
                          <span>{item.votes} votes</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Vote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Request CTA */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Have a Feature Request?</CardTitle>
            <CardDescription className="text-base">
              We'd love to hear your ideas! Submit your feature requests and vote on others' suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Submit Feature Request</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/support">Join Community Forum</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-8 bg-secondary/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> This roadmap is subject to change based on user feedback, technical feasibility, 
              and business priorities. Dates and features are estimates and not guaranteed. We reserve the right to 
              modify, delay, or cancel any planned features.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
