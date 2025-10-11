import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const featuredPost = {
    title: "10 Essential WordPress Security Tips for 2025",
    excerpt: "Protect your WordPress site from hackers with these proven security strategies. Learn how to implement two-factor authentication, configure firewalls, and monitor for threats.",
    category: "Security",
    author: "Sarah Chen",
    date: "January 15, 2025",
    readTime: "8 min read",
    image: "/blog/security-tips.jpg"
  };

  const blogPosts = [
    {
      title: "How to Speed Up Your WordPress Site: A Complete Guide",
      excerpt: "Discover proven techniques to dramatically improve your WordPress site's loading speed and Core Web Vitals scores.",
      category: "Performance",
      author: "Mike Johnson",
      date: "January 12, 2025",
      readTime: "10 min read"
    },
    {
      title: "WooCommerce Optimization: Boost Your Store Sales by 40%",
      excerpt: "Learn the strategies successful store owners use to increase conversions and maximize revenue.",
      category: "E-Commerce",
      author: "Emily Rodriguez",
      date: "January 10, 2025",
      readTime: "12 min read"
    },
    {
      title: "SEO Best Practices for WordPress in 2025",
      excerpt: "Stay ahead of the competition with the latest SEO techniques and strategies for WordPress sites.",
      category: "SEO",
      author: "David Park",
      date: "January 8, 2025",
      readTime: "15 min read"
    },
    {
      title: "Database Optimization: Clean Up Your WordPress Database",
      excerpt: "Improve performance by removing unnecessary data and optimizing your database tables.",
      category: "Performance",
      author: "Lisa Thompson",
      date: "January 5, 2025",
      readTime: "7 min read"
    },
    {
      title: "Automated Backups: Never Lose Your Website Data Again",
      excerpt: "Set up automated backup solutions to protect your WordPress site from data loss.",
      category: "Backup",
      author: "James Wilson",
      date: "January 3, 2025",
      readTime: "9 min read"
    },
    {
      title: "Content Protection: Safeguard Your Original Content",
      excerpt: "Prevent content theft and unauthorized copying with these effective protection techniques.",
      category: "Security",
      author: "Anna Martinez",
      date: "December 28, 2024",
      readTime: "6 min read"
    }
  ];

  const categories = [
    { name: "All Posts", count: 156 },
    { name: "Performance", count: 45 },
    { name: "Security", count: 38 },
    { name: "SEO", count: 32 },
    { name: "E-Commerce", count: 25 },
    { name: "Tutorials", count: 16 }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Instant Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, tutorials, and insights to help you get the most out of your WordPress site
          </p>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="bg-secondary/30 h-[300px] lg:h-auto flex items-center justify-center">
              <div className="text-4xl font-bold text-muted-foreground opacity-20">
                Featured Post
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
              <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime}
                </div>
              </div>
              <Button className="w-fit group">
                Read Article
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link
                        href="#"
                        className="flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors"
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Newsletter</CardTitle>
                <CardDescription>
                  Get the latest tips and updates delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow flex flex-col">
                  <div className="bg-secondary/30 h-[200px] flex items-center justify-center">
                    <div className="text-2xl font-bold text-muted-foreground opacity-20">
                      {post.category}
                    </div>
                  </div>
                  <CardHeader>
                    <Badge className="w-fit mb-2">{post.category}</Badge>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">1</Button>
              <Button>2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">4</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
