"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessagesSquare, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm here to help you with questions about our plugins and services. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    window.addEventListener("open-chatbot", open as EventListener);
    window.addEventListener("close-chatbot", close as EventListener);
    return () => {
      window.removeEventListener("open-chatbot", open as EventListener);
      window.removeEventListener("close-chatbot", close as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble answering that question. Please visit our contact page at https://instant.tw/contact or email wp@instant.tw for personalized assistance.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();

    // About company queries
    if (lowerQuery.includes("about") || lowerQuery.includes("company") || lowerQuery.includes("who are")) {
      return "Instant (https://instant.tw/) is a leading WordPress plugin provider founded in 2017. We serve 590,000+ WordPress sites worldwide with 12 premium plugins. Our mission is to make every WordPress site faster, more secure, and more successful. Learn more at https://instant.tw/about";
    }

    // Contact and support queries
    if (lowerQuery.includes("contact") || lowerQuery.includes("email") || lowerQuery.includes("reach")) {
      return "Contact us:\n\n• General: hello@instant.tw\n• Support: wp@instant.tw\n• Sales: sales@instant.tw\n• Partners: partners@instant.tw\n• Billing: billing@instant.tw\n\nOr visit https://instant.tw/contact";
    }

    // Privacy and terms queries
    if (lowerQuery.includes("privacy") || lowerQuery.includes("gdpr") || lowerQuery.includes("data")) {
      return "We take your privacy seriously and comply with GDPR and CCPA. View our Privacy Policy at https://instant.tw/privacy or contact privacy@instant.tw for data requests.";
    }

    if (lowerQuery.includes("terms") || lowerQuery.includes("service") || lowerQuery.includes("legal")) {
      return "Please review our Terms of Service at https://instant.tw/terms for complete details on licensing, usage rights, and legal agreements.";
    }

    // Refund policy queries
    if (lowerQuery.includes("refund") || lowerQuery.includes("money back") || lowerQuery.includes("guarantee") || lowerQuery.includes("cancel")) {
      return "We offer a 30-day money-back guarantee for first-time customers!\n\n• Full refund within 30 days of purchase\n• No questions asked\n• Contact billing@instant.tw to request\n\nView our complete Refund Policy at https://instant.tw/refund";
    }

    // Plugin-related queries
    if (lowerQuery.includes("plugin") || lowerQuery.includes("feature")) {
      if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("pricing")) {
        return "We offer flexible pricing plans:\n\n• Free Plan: 1 site, basic plugins\n• Pro Plan: $49/year, 5 sites\n• Agency Plan: $149/year, unlimited sites\n• Enterprise: Custom pricing\n\n30-day money-back guarantee on all paid plans. See https://instant.tw/pricing";
      }
      if (lowerQuery.includes("install") || lowerQuery.includes("setup")) {
        return "Installing our plugins is easy:\n\n1. Download from your account at https://instant.tw/\n2. Go to WordPress Admin → Plugins → Add New\n3. Upload the downloaded file\n4. Activate the plugin\n\nCheck our docs at https://instant.tw/docs for detailed guides.";
      }
      if (lowerQuery.includes("list") || lowerQuery.includes("available") || lowerQuery.includes("which")) {
        return "Our 12 WordPress plugins include:\n\n• Instant Speed Optimizer\n• Instant Security Guard\n• Instant SEO\n• Instant Woo\n• Instant Cache\n• Instant Database Optimizer\n• Instant Broken Link Fixer\n• Instant Content Protector\n• Instant Duplicator\n• Instant Uptime Monitor\n• Instant Form Builder\n• Instant Slider\n\nView all plugins at https://instant.tw/plugins";
      }
      return "We offer 12 premium WordPress plugins for performance, security, SEO, and e-commerce. All plugins include regular updates, documentation, and support. Browse at https://instant.tw/plugins";
    }

    // Support queries
    if (lowerQuery.includes("support") || lowerQuery.includes("help") || lowerQuery.includes("assist")) {
      return "We offer comprehensive support:\n\n• Free Plan: Community forums\n• Pro Plan: Priority email (24h response)\n• Agency Plan: Phone + email (2h response)\n• Enterprise: Dedicated account manager\n\nAverage response time: < 2 hours\nCustomer satisfaction: 97%\n\nVisit https://instant.tw/support or email wp@instant.tw";
    }

    // Documentation queries
    if (lowerQuery.includes("doc") || lowerQuery.includes("guide") || lowerQuery.includes("tutorial")) {
      return "Our documentation includes:\n\n• Installation guides\n• Plugin-specific documentation\n• Video tutorials\n• Developer API reference\n• Troubleshooting guides\n• FAQs\n\nVisit https://instant.tw/docs to search 500+ articles.";
    }

    // Roadmap and updates
    if (lowerQuery.includes("roadmap") || lowerQuery.includes("upcoming") || lowerQuery.includes("future")) {
      return "View our public roadmap at https://instant.tw/roadmap to see:\n\n• Upcoming features\n• In-progress development\n• Recently completed updates\n• Vote on features you want\n\nWe regularly update all plugins with new features and improvements.";
    }

    // Changelog queries
    if (lowerQuery.includes("changelog") || lowerQuery.includes("release") || lowerQuery.includes("version") || lowerQuery.includes("update")) {
      return "Our latest release v2.5.0 includes:\n\n• AI-powered SEO optimization\n• WebP & AVIF image conversion\n• Enhanced malware detection\n• Database optimization improvements\n\nView complete changelog at https://instant.tw/changelog";
    }

    // Career queries
    if (lowerQuery.includes("career") || lowerQuery.includes("job") || lowerQuery.includes("hiring") || lowerQuery.includes("work")) {
      return "Join our team! We're hiring:\n\n• Senior Full-Stack Developer\n• Product Designer\n• Marketing Manager\n• Customer Success Manager\n• DevOps Engineer\n• Data Analyst\n\n100% remote, competitive salary, great benefits.\nSee openings at https://instant.tw/careers";
    }

    // Partner queries
    if (lowerQuery.includes("partner") || lowerQuery.includes("reseller") || lowerQuery.includes("agency")) {
      return "Partner with us:\n\n• Technology Partners: API access, co-marketing\n• Agency Partners: Special pricing, white-label\n• Reseller Partners: Commission structure\n\n100+ active partners, 40% avg revenue increase.\nApply at https://instant.tw/partners";
    }

    // Affiliate queries
    if (lowerQuery.includes("affiliate") || lowerQuery.includes("commission") || lowerQuery.includes("earn")) {
      return "Join our Affiliate Program:\n\n• 30% recurring commission\n• 90-day cookie duration\n• $2,400 average monthly earnings\n• Free to join, instant approval\n\nTiers: Starter (30%), Pro (35%), Elite (40%)\n\nSign up at https://instant.tw/affiliates";
    }

    // Blog queries
    if (lowerQuery.includes("blog") || lowerQuery.includes("article") || lowerQuery.includes("news")) {
      return "Read our blog for:\n\n• WordPress performance tips\n• Security best practices\n• SEO strategies\n• E-commerce optimization\n• Plugin tutorials\n\n156+ articles across multiple categories.\nVisit https://instant.tw/blog";
    }

    // License queries
    if (lowerQuery.includes("license") || lowerQuery.includes("site") || lowerQuery.includes("domain")) {
      return "Our license structure:\n\n• Free Plan: 1 website\n• Pro Plan: Up to 5 websites\n• Agency Plan: Unlimited websites\n• Enterprise: Custom licensing\n\nManage licenses from your account dashboard at https://instant.tw/dashboard";
    }

    // WooCommerce queries
    if (lowerQuery.includes("woocommerce") || lowerQuery.includes("shop") || lowerQuery.includes("store") || lowerQuery.includes("e-commerce")) {
      return "Yes! Our Instant Woo plugin is specifically built for WooCommerce:\n\n• Store optimization\n• Checkout enhancements\n• Product management\n• Performance improvements\n• Full WooCommerce compatibility\n\nLearn more at https://instant.tw/plugins";
    }

    // Default fallback for unknown queries
    return "I'd be happy to help! Here are some helpful resources:\n\n1. Contact: https://instant.tw/contact\n2. Documentation: https://instant.tw/docs\n3. Support: wp@instant.tw\n4. General: hello@instant.tw\n\nWhat would you like to know about our plugins, pricing, or support?";
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[90vw] sm:w-96 max-w-md"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessagesSquare className="h-5 w-5" />
                    <CardTitle className="text-lg">Chat Support</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 hover:bg-primary-foreground/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-primary-foreground/90 mt-1">
                  Ask me anything about our plugins
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-[9999]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-[60px] h-[60px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50"
            aria-label="Open chat support"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping-slow" />
            
            {/* Chat icon */}
            <svg
              className="relative w-7 h-7 text-white transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5286 20 9.13759 19.6759 7.8952 19.0971L3 20L4.3515 16.1974C3.4656 15.0038 3 13.5594 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      )}
      
      {isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-[9999]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50"
            aria-label="Close chat"
          >
            <X className="w-7 h-7 text-white" />
          </button>
        </motion.div>
      )}
    </>
  );
}
