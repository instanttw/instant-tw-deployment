import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, TrendingUp, Heart, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Active Customers", value: "590K+" },
    { icon: Award, label: "Awards Won", value: "15+" },
    { icon: TrendingUp, label: "Years in Business", value: "8+" },
    { icon: Zap, label: "Plugins Developed", value: "12" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former WordPress core contributor with 10+ years of experience building scalable web solutions."
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer specializing in performance optimization and distributed systems."
    },
    {
      name: "Emily Thompson",
      role: "Head of Product",
      bio: "Previously led product teams at Automattic, passionate about user experience."
    },
    {
      name: "David Park",
      role: "Lead Security Engineer",
      bio: "Cybersecurity expert with certifications in ethical hacking and security architecture."
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "Every decision we make is driven by what's best for our customers and their success."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly push boundaries to create cutting-edge solutions for WordPress."
    },
    {
      icon: Award,
      title: "Quality",
      description: "We maintain the highest standards in code quality, security, and performance."
    },
    {
      icon: Heart,
      title: "Community",
      description: "We believe in giving back and supporting the WordPress community."
    },
    {
      icon: Zap,
      title: "Speed",
      description: "Fast websites, fast support, fast innovation - speed is in our DNA."
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "We're committed to continuous improvement and helping our customers grow."
    }
  ];

  const milestones = [
    { year: "2017", event: "Company founded by WordPress enthusiasts" },
    { year: "2018", event: "Launched first plugin: Instant Speed Optimizer" },
    { year: "2019", event: "Reached 10,000 active installations" },
    { year: "2020", event: "Expanded to security and SEO solutions" },
    { year: "2021", event: "Achieved 100,000+ active users milestone" },
    { year: "2022", event: "Launched Enterprise support program" },
    { year: "2023", event: "Reached 500,000+ active customers" },
    { year: "2024", event: "Won Best WordPress Plugin Suite award" },
    { year: "2025", event: "Serving 590,000+ WordPress sites worldwide" }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">About Instant</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building the Future of<br />WordPress Performance
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're a team of passionate developers, designers, and WordPress enthusiasts on a mission 
            to make every WordPress site faster, more secure, and more successful.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-muted-foreground">
              <p>
                Instant was born in 2017 from a simple frustration: WordPress sites were becoming slower 
                and more vulnerable as the web grew more complex. Our founders, both active contributors 
                to the WordPress community, saw an opportunity to make a difference.
              </p>
              <p>
                What started as a single performance optimization plugin has grown into a comprehensive 
                suite of 12 premium WordPress plugins trusted by over 590,000 websites worldwide. Our 
                solutions power everything from small blogs to enterprise e-commerce stores.
              </p>
              <p>
                Today, we're proud to be one of the leading WordPress plugin developers, with a team of 
                50+ talented individuals spread across 15 countries. But our mission remains the same: 
                to help WordPress site owners succeed by providing them with the best tools possible.
              </p>
              <p>
                We believe in the power of open source, the importance of community, and the potential 
                of every website to make an impact. That's why we're committed to creating products that 
                are not just powerful, but also accessible and easy to use.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-24 w-24 rounded-full bg-secondary mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Badge className="text-lg font-bold px-4 py-2">{milestone.year}</Badge>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle>Join Our Team</CardTitle>
              <CardDescription>
                We're always looking for talented individuals to join our mission
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/careers">View Open Positions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle>Partner With Us</CardTitle>
              <CardDescription>
                Collaborate with us to bring value to our mutual customers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/partners">Become a Partner</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
