import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Users, Code, Palette, Megaphone, BarChart, TrendingUp, Heart } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Industry-leading compensation packages with regular reviews"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work when you're most productive with flexible scheduling"
    },
    {
      icon: MapPin,
      title: "Remote-First",
      description: "Work from anywhere in the world with our distributed team"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Continuous learning opportunities and clear career paths"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with talented, passionate people who love what they do"
    }
  ];

  const openings = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      icon: Code,
      description: "Build and maintain our WordPress plugin suite using PHP, React, and Node.js",
      requirements: ["5+ years experience", "PHP & JavaScript expert", "WordPress development"]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      icon: Palette,
      description: "Create beautiful, intuitive interfaces for our plugins and marketing site",
      requirements: ["3+ years experience", "Figma proficiency", "User research skills"]
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "San Francisco / Remote",
      type: "Full-time",
      icon: Megaphone,
      description: "Lead our marketing strategy to reach more WordPress users worldwide",
      requirements: ["4+ years experience", "SaaS marketing", "Content strategy"]
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      icon: Users,
      description: "Help customers succeed with our products through onboarding and support",
      requirements: ["2+ years experience", "WordPress knowledge", "Excellent communication"]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      icon: Code,
      description: "Manage our infrastructure, CI/CD pipelines, and deployment systems",
      requirements: ["3+ years experience", "AWS/GCP", "Docker & Kubernetes"]
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      icon: BarChart,
      description: "Analyze user data to drive product decisions and business growth",
      requirements: ["2+ years experience", "SQL proficiency", "Data visualization"]
    }
  ];

  const values = [
    "Customer obsessed",
    "Move fast, think big",
    "Embrace challenges",
    "Be transparent",
    "Own it",
    "Have fun"
  ];

  const perks = [
    "🏖️ Unlimited PTO",
    "💻 Latest equipment",
    "📚 Learning budget",
    "🎉 Team retreats",
    "🍕 Lunch & learns",
    "🏠 Home office setup"
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">We're Hiring!</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build the Future of<br />WordPress with Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Join a team of passionate developers, designers, and WordPress enthusiasts making 
            the web faster and more secure for millions of users worldwide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="#openings">View Open Positions</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn About Us</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">15</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Remote</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-sm text-muted-foreground">Glassdoor Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Why Join Instant?</h2>
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

        {/* Perks */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Perks & Benefits</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <p className="font-semibold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div id="openings" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {openings.map((job, index) => {
              const Icon = job.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <Badge variant="secondary">{job.department}</Badge>
                          </div>
                          <CardDescription className="mb-3">{job.description}</CardDescription>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, idx) => (
                        <Badge key={idx} variant="outline">{req}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Don't See a Fit */}
        <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Don't See a Perfect Fit?</CardTitle>
            <CardDescription>
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" asChild>
              <Link href="/contact">Send Your Resume</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
