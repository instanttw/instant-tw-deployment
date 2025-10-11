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
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Accessibility: focus input when opening and allow Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const to = setTimeout(() => inputRef.current?.focus(), 100);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(to);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

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

  // Popular preloaded questions
  const popularQuestions = [
    "What plugins do you offer?",
    "How much does the Pro plan cost?",
    "Do you offer a money-back guarantee?"
  ];

  const handlePreloadedQuestion = (question: string) => {
    setInput(question);
    // Auto-submit the preloaded question
    const submitEvent = { preventDefault: () => {}, target: { querySelector: () => ({ focus: () => {} }) } } as any;
    setTimeout(() => handleSubmit(submitEvent), 100);
  };

  const generateResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();

    // Plugin-specific queries with updated info
    if (lowerQuery.includes("plugin") || lowerQuery.includes("feature")) {
      if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("pricing")) {
        return "Our pricing plans:\n\n• Pro Plan: $49/month ($441/year - save 25%)\n  └ 3 websites, all 12 plugins included\n\n• Agency Plan: $299/month ($2,691/year - save 25%)\n  └ 25 websites, priority support, white-label\n\n• Enterprise Plan: $999/month ($8,991/year - save 25%)\n  └ Unlimited websites, 24/7 support, custom development\n\n30-day money-back guarantee on all plans!\nView details: https://instant.tw/pricing";
      }
      if (lowerQuery.includes("seo")) {
        return "Our Advanced SEO Toolkit helps improve your search rankings:\n\n• Keyword rank tracking\n• Meta tag optimization\n• XML sitemaps generation\n• Schema markup\n• Google Analytics integration\n\nAvailable in Free version and Pro ($19/month standalone).\nIncluded in all paid plans. Learn more: https://instant.tw/plugins";
      }
      if (lowerQuery.includes("security")) {
        return "Security Shield provides enterprise-grade protection:\n\n• Real-time malware scanning\n• Firewall protection\n• Login security & brute force protection\n• Security monitoring & reports\n• Vulnerability patches\n\nStandalone: $39/month | Included in all paid plans\nProtect your site: https://instant.tw/plugins";
      }
      if (lowerQuery.includes("speed") || lowerQuery.includes("performance")) {
        return "Performance Pro makes WordPress lightning fast:\n\n• Advanced caching optimization\n• Image compression & WebP conversion\n• Database cleanup & optimization\n• CDN integration\n• Performance monitoring\n\nStandalone: $19/month | Included in all paid plans\nSpeed up your site: https://instant.tw/plugins";
      }
      if (lowerQuery.includes("backup")) {
        return "Backup Master ensures your data is always safe:\n\n• Automated daily backups\n• Cloud storage (Google Drive, Dropbox, S3)\n• One-click restore functionality\n• Incremental backups\n• Site migration tools\n\nFree version available | Pro: $15/month\nIncluded in all paid plans. Secure your data: https://instant.tw/plugins";
      }
      if (lowerQuery.includes("woocommerce") || lowerQuery.includes("ecommerce")) {
        return "WooCommerce Boost supercharges your online store:\n\n• Abandoned cart recovery\n• Product recommendations\n• Conversion rate optimization\n• Marketing automation\n• Advanced analytics\n\nStandalone: $29/month | Included in all paid plans\nBoost sales: https://instant.tw/plugins";
      }
      if (lowerQuery.includes("form")) {
        return "Form Builder Pro creates powerful forms:\n\n• Drag & drop form builder\n• Conditional logic\n• Payment integration (Stripe, PayPal)\n• Email marketing integration\n• Advanced analytics\n\nStandalone: $25/month | Included in all paid plans\nBuild forms: https://instant.tw/plugins";
      }
      if (lowerQuery.includes("list") || lowerQuery.includes("available") || lowerQuery.includes("which") || lowerQuery.includes("what plugins")) {
        return "Our 12 premium WordPress plugins:\n\n🚀 Advanced SEO Toolkit\n🛡️ Security Shield\n⚡ Performance Pro\n💾 Backup Master\n🛒 WooCommerce Boost\n📝 Form Builder Pro\n📊 Analytics Pro\n🔍 Search Enhance\n📧 Email Marketing\n🎨 Design Tools\n🔧 Developer Utils\n📱 Mobile Optimizer\n\nAll included in paid plans. Browse: https://instant.tw/plugins";
      }
      return "We offer 12 premium WordPress plugins covering SEO, security, performance, backups, forms, and more. All plugins include regular updates, premium support, and are covered by our 30-day money-back guarantee. Browse all: https://instant.tw/plugins";
    }

    // About company queries
    if (lowerQuery.includes("about") || lowerQuery.includes("company") || lowerQuery.includes("who are")) {
      return "Instant is a leading WordPress plugin provider empowering 5.7 million websites worldwide. Founded with a mission to make WordPress sites faster, more secure, and successful. We're trusted by agencies, developers, and businesses globally. Learn more: https://instant.tw/about";
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

    // Pricing-specific queries
    if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("pricing") || lowerQuery.includes("how much")) {
      if (lowerQuery.includes("pro")) {
        return "Pro Plan: $49/month or $441/year (25% savings)\n\n✅ All 12 premium plugins included\n✅ Use on up to 3 websites\n✅ 1 year of updates & support\n✅ Priority email support\n✅ 30-day money-back guarantee\n\nPerfect for individuals and small businesses.\nGet started: https://instant.tw/pricing";
      } else if (lowerQuery.includes("agency")) {
        return "Agency Plan: $299/month or $2,691/year (25% savings)\n\n✅ All 12 premium plugins included\n✅ Use on up to 25 websites\n✅ Priority email & phone support\n✅ White label options\n✅ API access\n✅ Dedicated account manager\n\nPerfect for agencies managing multiple clients.\nGet started: https://instant.tw/pricing";
      } else if (lowerQuery.includes("enterprise")) {
        return "Enterprise Plan: $999/month or $8,991/year (25% savings)\n\n✅ All 12 premium plugins included\n✅ Unlimited websites\n✅ 24/7 priority support\n✅ Custom SLA guarantee\n✅ On-site training\n✅ Custom development\n✅ Security audits\n\nPerfect for large organizations.\nContact sales: https://instant.tw/pricing";
      } else {
        return "Our pricing plans:\n\n💫 Pro: $49/month (3 sites)\n🏢 Agency: $299/month (25 sites)\n🏛️ Enterprise: $999/month (unlimited)\n\nAll plans include:\n• All 12 premium plugins\n• Regular updates & support\n• 30-day money-back guarantee\n• Save 25% with yearly billing\n\nView details: https://instant.tw/pricing";
      }
    }

    // Installation and setup
    if (lowerQuery.includes("install") || lowerQuery.includes("setup") || lowerQuery.includes("how to")) {
      return "Installing our plugins is simple:\n\n1. Download from your account dashboard\n2. Go to WordPress Admin → Plugins → Add New\n3. Upload the downloaded ZIP file\n4. Click 'Install Now' then 'Activate'\n\nDetailed installation guides with screenshots available at https://instant.tw/docs";
    }

    // Support queries
    if (lowerQuery.includes("support") || lowerQuery.includes("help") || lowerQuery.includes("assist")) {
      return "We provide excellent support:\n\n💬 Live Chat: < 2 min response (Mon-Fri 9am-6pm EST)\n📧 Email Support: < 24 hours (24/7)\n🎫 Ticketing System: < 12 hours (24/7)\n\nSupport by plan:\n• Pro: Priority email support\n• Agency: Email + phone support\n• Enterprise: 24/7 dedicated account manager\n\n📊 97% customer satisfaction rate\n📈 Average response time: < 2 hours\n\nGet help: https://instant.tw/support or wp@instant.tw";
    }

    // WP Scan service queries
    if (lowerQuery.includes("scan") || lowerQuery.includes("wp scan") || lowerQuery.includes("security scan")) {
      return "WP Scan - WordPress Security Scanner:\n\n🔍 Free security scans available\n🛡️ Scan for vulnerabilities in seconds\n📊 Track outdated plugins & themes\n💡 Get actionable security recommendations\n🔄 24/7 automated monitoring available\n\nFree scan: Instant vulnerability report\nPremium monitoring: Starting at $19/month\n\nTry free scan: https://instant.tw/wp-scan";
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed z-[9999] bottom-5 right-5 left-5 sm:left-auto sm:right-6 sm:bottom-6 w-auto"
          >
            <Card className="w-full sm:w-[380px] lg:w-[420px] h-[90vh] sm:h-[80vh] lg:h-[640px] max-h-[92vh] flex flex-col rounded-2xl shadow-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessagesSquare className="h-5 w-5" />
                    <CardTitle className="text-lg">Chat Support</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-primary-foreground/90">Online</span>
                    </div>
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
                  Ask me about plugins, pricing, and support
                </p>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Show preloaded questions only on first load */}
                  {messages.length === 1 && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">Popular questions:</p>
                      <div className="space-y-2">
                        {popularQuestions.map((question, index) => (
<button
                            key={index}
                            type="button"
                            onClick={() => handlePreloadedQuestion(question)}
                            className="w-full text-left p-2 text-sm font-medium bg-white text-gray-900 dark:text-gray-900 hover:bg-primary/10 border border-border rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label={`Ask: ${question}`}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                  <div className="flex gap-2 mb-3">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Type your question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      className="flex-1 focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Type your question"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Need more help? <a href="/support" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Contact our support team</a>
                  </p>
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
