import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Gift, Target, Zap, BarChart, Award } from "lucide-react";
import Link from "next/link";

export default function AffiliatesPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "30% Commission",
      description: "Earn 30% recurring commission on all sales you refer"
    },
    {
      icon: TrendingUp,
      title: "Recurring Revenue",
      description: "Get paid every month as long as your referrals remain customers"
    },
    {
      icon: Gift,
      title: "Bonus Incentives",
      description: "Earn extra bonuses when you hit performance milestones"
    },
    {
      icon: Zap,
      title: "90-Day Cookie",
      description: "Long cookie duration means more conversions for you"
    },
    {
      icon: BarChart,
      title: "Real-Time Analytics",
      description: "Track clicks, conversions, and earnings in real-time"
    },
    {
      icon: Award,
      title: "Marketing Materials",
      description: "Access to banners, email templates, and promotional content"
    }
  ];

  const stats = [
    { label: "Commission Rate", value: "30%" },
    { label: "Cookie Duration", value: "90 Days" },
    { label: "Average Order Value", value: "$299" },
    { label: "Avg. Monthly Earnings", value: "$2,400" }
  ];

  const tiers = [
    {
      name: "Starter",
      sales: "0-10 sales/month",
      commission: "30%",
      perks: [
        "30% recurring commission",
        "90-day cookie duration",
        "Marketing materials",
        "Email support"
      ]
    },
    {
      name: "Professional",
      sales: "11-50 sales/month",
      commission: "35%",
      perks: [
        "35% recurring commission",
        "90-day cookie duration",
        "Priority support",
        "Custom landing pages",
        "Co-marketing opportunities"
      ],
      popular: true
    },
    {
      name: "Elite",
      sales: "51+ sales/month",
      commission: "40%",
      perks: [
        "40% recurring commission",
        "90-day cookie duration",
        "Dedicated account manager",
        "Custom discount codes",
        "Featured affiliate spotlight",
        "Quarterly performance bonuses"
      ]
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up Free",
      description: "Create your affiliate account in minutes. No approval wait time."
    },
    {
      step: "2",
      title: "Get Your Link",
      description: "Access your unique affiliate links and marketing materials."
    },
    {
      step: "3",
      title: "Promote",
      description: "Share your links on your blog, social media, or email list."
    },
    {
      step: "4",
      title: "Earn Commission",
      description: "Get paid 30% recurring commission on every sale you refer."
    }
  ];

  const whoCanJoin = [
    {
      icon: Users,
      title: "Content Creators",
      description: "Bloggers, YouTubers, and podcasters in the WordPress space"
    },
    {
      icon: Target,
      title: "WordPress Educators",
      description: "Course creators and tutorial makers teaching WordPress"
    },
    {
      icon: Award,
      title: "Web Agencies",
      description: "Development agencies recommending tools to clients"
    },
    {
      icon: Zap,
      title: "Tech Influencers",
      description: "Social media influencers with an audience interested in WordPress"
    }
  ];

  const faqs = [
    {
      question: "How much can I earn?",
      answer: "You earn 30% recurring commission on all sales. Our top affiliates earn $5,000+ per month. Average earnings are around $2,400/month."
    },
    {
      question: "When do I get paid?",
      answer: "Commissions are paid monthly via PayPal or bank transfer, 30 days after the sale (to account for refunds)."
    },
    {
      question: "Is there a minimum payout?",
      answer: "Yes, the minimum payout threshold is $50. If you don't reach $50 in a month, it rolls over to the next month."
    },
    {
      question: "Can I use my own discount code?",
      answer: "Yes! Elite tier affiliates can create custom discount codes. All affiliates can use our standard promotional codes."
    },
    {
      question: "What marketing materials do you provide?",
      answer: "We provide banner ads, email templates, social media graphics, product screenshots, and more."
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Affiliate Program</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Earn 30% Recurring<br />Commission for Life
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Join our affiliate program and earn generous recurring commissions by promoting 
            the #1 WordPress plugin suite to your audience.
          </p>
          <Button size="lg" className="mb-4">
            Join the Affiliate Program
          </Button>
          <p className="text-sm text-muted-foreground">
            No approval needed • Start earning in minutes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Why Join Our Affiliate Program?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Commission Tiers */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Commission Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <Card key={index} className={tier.popular ? "border-primary border-2" : ""}>
                {tier.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.sales}</CardDescription>
                  <div className="text-4xl font-bold text-primary mt-4">
                    {tier.commission}
                  </div>
                  <p className="text-sm text-muted-foreground">commission rate</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary text-xs">✓</span>
                        </span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Who Can Join */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Who Should Join?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoCanJoin.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Success Story */}
        <Card className="mb-20 bg-secondary/30 max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Success Story</h3>
            </div>
            <blockquote className="text-center italic text-muted-foreground mb-4">
              "I've been an Instant affiliate for 2 years now and consistently earn $5,000+ per month. 
              The recurring commission model is a game-changer, and their support team is amazing!"
            </blockquote>
            <p className="text-center font-semibold">
              - Jessica M., WordPress Blogger & Elite Affiliate
            </p>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-20">
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
        </div>

        {/* CTA Section */}
        <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Ready to Start Earning?</CardTitle>
            <CardDescription className="text-base">
              Join thousands of affiliates earning recurring commissions by promoting 
              the best WordPress plugins in the market.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Join Now - It's Free
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Have Questions?</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
