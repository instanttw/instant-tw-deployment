import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, TrendingUp, Award, Users, Code, Globe, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function PartnersPage() {
  const partnerTypes = [
    {
      icon: Code,
      title: "Technology Partners",
      description: "Integrate your products with our plugins",
      benefits: [
        "Technical documentation & API access",
        "Co-marketing opportunities",
        "Priority support channel",
        "Early access to new features"
      ]
    },
    {
      icon: Users,
      title: "Agency Partners",
      description: "Offer our solutions to your clients",
      benefits: [
        "Special agency pricing",
        "White-label options",
        "Dedicated account manager",
        "Custom training sessions"
      ]
    },
    {
      icon: Globe,
      title: "Reseller Partners",
      description: "Sell our products in your market",
      benefits: [
        "Attractive commission structure",
        "Marketing materials",
        "Sales training & support",
        "Quarterly business reviews"
      ]
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Together",
      description: "Access to our 590K+ customer base and expand your reach"
    },
    {
      icon: Award,
      title: "Co-Marketing",
      description: "Joint marketing campaigns and featured partner spotlights"
    },
    {
      icon: Zap,
      title: "Priority Support",
      description: "Dedicated support channel with faster response times"
    },
    {
      icon: Shield,
      title: "Trusted Brand",
      description: "Associate with a leading WordPress plugin provider"
    }
  ];

  const existingPartners = [
    { name: "WooCommerce", category: "E-Commerce Platform" },
    { name: "Cloudflare", category: "CDN & Security" },
    { name: "Amazon Web Services", category: "Cloud Infrastructure" },
    { name: "Stripe", category: "Payment Processing" },
    { name: "Google Analytics", category: "Analytics" },
    { name: "Mailchimp", category: "Email Marketing" }
  ];

  const requirements = [
    "Proven track record in your industry",
    "Commitment to customer success",
    "Technical expertise or strong sales capabilities",
    "Alignment with our values and mission",
    "Ability to provide references"
  ];

  const steps = [
    {
      number: "1",
      title: "Submit Application",
      description: "Fill out our partnership application form with your company details"
    },
    {
      number: "2",
      title: "Initial Review",
      description: "Our partnerships team reviews your application within 5 business days"
    },
    {
      number: "3",
      title: "Discovery Call",
      description: "We schedule a call to discuss partnership opportunities and fit"
    },
    {
      number: "4",
      title: "Agreement",
      description: "Sign partnership agreement and receive onboarding materials"
    },
    {
      number: "5",
      title: "Launch",
      description: "Start collaborating with dedicated support from our team"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Partnership Program</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Let's Grow Together
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Join our partner ecosystem and unlock new opportunities to serve your customers better 
            while growing your business alongside ours.
          </p>
          <Button size="lg" asChild>
            <a href="#apply">Become a Partner</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Active Partners</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Avg. Revenue Increase</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">590K+</div>
              <div className="text-sm text-muted-foreground">Customer Base</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">25</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
        </div>

        {/* Partner Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Partnership Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Partner Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Existing Partners */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Trusted by Industry Leaders</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {existingPartners.map((partner, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-secondary/30">
                    <p className="font-semibold mb-1">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Partnership Requirements</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-bold">✓</span>
                    </div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div id="apply">
          <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Ready to Partner with Us?</CardTitle>
              <CardDescription className="text-base">
                Submit your application today and join our growing partner ecosystem. 
                Our team will review your application and get back to you within 5 business days.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule a Call</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
