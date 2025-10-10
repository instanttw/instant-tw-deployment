"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageSquare, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("General Inquiries");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      detail: "Available Mon-Fri, 9am-6pm EST",
      action: "Start Chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      detail: "wp@instant.tw",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team directly",
      detail: "+1 646 693 8098",
      action: "Call Now"
    }
  ];

  // Offices section removed per request

  const departments = [
    { name: "General Inquiries", email: "hello@instant.tw" },
    { name: "Technical Support", email: "wp@instant.tw" },
    { name: "Sales", email: "sales@instant.tw" },
    { name: "Partnerships", email: "partners@instant.tw" },
    { name: "Press & Media", email: "press@instant.tw" },
    { name: "Billing", email: "billing@instant.tw" }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card key={index} className={method.primary ? "border-primary" : ""}>
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm font-medium mb-4">{method.detail}</p>
                  {method.title === "Live Chat" ? (
                    <Button
                      variant={method.primary ? "default" : "outline"}
                      className="w-full"
                      onClick={() => window.dispatchEvent(new Event("open-chatbot"))}
                    >
                      {method.action}
                    </Button>
                  ) : method.title === "Email Support" ? (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`mailto:${method.detail}?subject=Support%20Request`}>{method.action}</a>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`tel:+16466938098`}>{method.action}</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e)=>{e.preventDefault();}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">First Name</label>
                    <Input placeholder="John" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Name</label>
                    <Input placeholder="Doe" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="john@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="How can we help?" value={subject} onChange={(e)=>setSubject(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <select className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 dark:bg-background dark:text-foreground" value={department} onChange={(e)=>setDepartment(e.target.value)}>
                    <option className="text-gray-900">General Inquiries</option>
                    <option className="text-gray-900">Technical Support</option>
                    <option className="text-gray-900">Sales</option>
                    <option className="text-gray-900">Partnerships</option>
                    <option className="text-gray-900">Billing</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    className="min-h-[150px]"
                    placeholder="Tell us more about your inquiry..."
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                  />
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={submitting} onClick={async()=>{
                  if (!email || !subject || !message) { toast.error('Please fill in Email, Subject and Message'); return; }
                  try {
                    // call API
                    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, subject, department, message }) });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to send message');
                    toast.success("Message sent. We'll get back to you soon.");
                    setFirstName(''); setLastName(''); setEmail(''); setSubject(''); setDepartment('General Inquiries'); setMessage('');
                  } catch (e:any) {
                    toast.error(e?.message || 'Failed to send message');
                  }
                }}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="space-y-6">
            {/* Business Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle>Business Hours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-4 border-t">
                    <Badge variant="secondary">24/7 Email Support Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle>Departments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <a
                        href={`mailto:${dept.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{"<"} 2 Hours</div>
                  <p className="text-sm text-muted-foreground">Average Response Time</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Locations removed */}

        {/* FAQ Link */}
        <Card className="max-w-2xl mx-auto bg-secondary/30">
          <CardHeader className="text-center">
            <CardTitle>Looking for Quick Answers?</CardTitle>
            <CardDescription>
              Check out our documentation and FAQ section for instant solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/docs">Browse Documentation</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/support">Visit Support Center</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
