"use client";

import { FAQSchema } from "@/components/seo/faq-schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What are WordPress plugins?",
    answer: "WordPress plugins are software extensions that add specific features and functionality to your WordPress website. They can enhance security, improve performance, add contact forms, optimize SEO, and much more without requiring coding knowledge.",
  },
  {
    question: "Are premium WordPress plugins worth it?",
    answer: "Yes, premium WordPress plugins offer advanced features, regular updates, professional support, and better security compared to free alternatives. They're essential for businesses that need reliable, feature-rich solutions with guaranteed maintenance.",
  },
  {
    question: "How do I install a WordPress plugin?",
    answer: "To install a WordPress plugin, log in to your WordPress admin dashboard, go to Plugins > Add New, search for the plugin, click 'Install Now', and then 'Activate'. For premium plugins, upload the ZIP file via Plugins > Add New > Upload Plugin.",
  },
  {
    question: "Can I use plugins on multiple WordPress sites?",
    answer: "It depends on your license. Our Pro plan allows use on up to 3 sites, Agency plan on 25 sites, and Enterprise plan on unlimited sites. Each license level is designed for different usage scenarios.",
  },
  {
    question: "What is WordPress security scanning?",
    answer: "WordPress security scanning checks your website for vulnerabilities, malware, outdated plugins, themes, and core files. Our WP Scan tool provides free security audits to identify potential threats before they become serious problems.",
  },
  {
    question: "How often should I update WordPress plugins?",
    answer: "You should update WordPress plugins immediately when updates are available. Updates often contain security patches, bug fixes, and new features. Enable automatic updates for minor releases and manually review major updates.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee on all purchases. If you're not satisfied with any of our plugins or services within 30 days of purchase, contact our support team for a full refund.",
  },
  {
    question: "What WordPress hosting do you recommend?",
    answer: "We recommend managed WordPress hosting providers like WP Engine, Kinsta, or our own hosting services. These offer optimized performance, automatic backups, enhanced security, and expert WordPress support.",
  },
  {
    question: "How can I speed up my WordPress site?",
    answer: "Speed up WordPress by using caching plugins, optimizing images (use our Image Optimizer), using a CDN, choosing quality hosting, minimizing plugins, and enabling lazy loading. Our speed optimization service can help achieve sub-2 second load times.",
  },
  {
    question: "Is WordPress good for SEO?",
    answer: "Yes, WordPress is excellent for SEO. It's inherently SEO-friendly with clean code, proper HTML structure, and easy customization. Using SEO plugins and following best practices can help you rank highly in search engines like Google and Bing.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/10">
      <FAQSchema faqs={faqs} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our WordPress plugins and services
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}