"use client";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, FileText, Clock, CheckCircle, Video, Book } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SupportPage() {
  const supportChannels = [
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      availability: "Mon-Fri, 9am-6pm EST",
      responseTime: "< 2 minutes",
      badge: "Fastest",
      action: "Start Chat",
      href: "#live-chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      availability: "24/7",
      responseTime: "< 24 hours",
      badge: "Pro & Agency",
      action: "Send Email",
      href: "/contact"
    },
    {
      icon: FileText,
      title: "Submit a Ticket",
      description: "Create a support ticket for tracking",
      availability: "24/7",
      responseTime: "< 12 hours",
      badge: "All Plans",
      action: "Create Ticket",
      href: "/support/ticket"
    }
  ];

  const resources = [
    {
      icon: Book,
      title: "Documentation",
      description: "Detailed guides and tutorials",
      link: "/docs"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      link: "/docs"
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Ask questions and share tips",
      link: "/community"
    },
    {
      icon: FileText,
      title: "Knowledge Base",
      description: "Search our help articles",
      link: "/docs"
    }
  ];

  const faqs = [
    {
      question: "How do I install a plugin?",
      answer: "You can install plugins directly from your WordPress dashboard or upload them manually via FTP."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee on all paid plans. No questions asked."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes! You can change your plan at any time from your account dashboard. Changes take effect immediately."
    },
    {
      question: "How many websites can I use the plugins on?",
      answer: "It depends on your plan. Free: 1 site, Pro: 5 sites, Agency: Unlimited sites."
    },
    {
      question: "Do you offer custom development?",
      answer: "Yes! Enterprise and custom plans include dedicated development support. Contact our sales team."
    }
  ];

  const supportStats = [
    { label: "Average Response Time", value: "< 2 hours" },
    { label: "Customer Satisfaction", value: "97%" },
    { label: "Tickets Resolved", value: "50K+" },
    { label: "Support Articles", value: "500+" }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Can We Help You?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our dedicated support team is here to ensure you have the best experience with our plugins
          </p>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {supportStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Support Channel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge>{channel.badge}</Badge>
                    </div>
                    <CardTitle>{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{channel.availability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Response time: {channel.responseTime}</span>
                      </div>
                    </div>
                    {channel.title === "Live Chat Support" ? (
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new Event("open-chatbot"));
                          }
                        }}
                      >
                        {channel.action}
                      </Button>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href={channel.href}>{channel.action}</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Self-Help Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Self-Help Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Link key={index} href={resource.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">View All FAQs</Link>
            </Button>
          </div>
        </div>

        {/* Emergency Support */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Need Urgent Help?</CardTitle>
            <CardDescription className="text-base">
              Enterprise customers have access to 24/7 priority support with dedicated account managers
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" asChild>
              <Link href="/pricing">Upgrade to Enterprise</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
