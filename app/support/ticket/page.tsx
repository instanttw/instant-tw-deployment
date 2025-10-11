"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SubmitTicketPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("normal");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Subject and message are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, category, priority, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit ticket");
      toast.success("Ticket submitted successfully");
      router.push("/support");
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
            <CardDescription>Our team will get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e)=>setSubject(e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 dark:bg-background dark:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option className="text-gray-900" value="General">General</option>
                    <option className="text-gray-900" value="Technical">Technical</option>
                    <option className="text-gray-900" value="Billing">Billing</option>
                    <option className="text-gray-900" value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e)=>setPriority(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 dark:bg-background dark:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option className="text-gray-900" value="low">Low</option>
                    <option className="text-gray-900" value="normal">Normal</option>
                    <option className="text-gray-900" value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea id="message" className="w-full px-3 py-2 border rounded-md min-h-[150px]" value={message} onChange={(e)=>setMessage(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
