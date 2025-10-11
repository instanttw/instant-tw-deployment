"use client";

import { Shield, Zap, HeadphonesIcon, Code, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with regular updates and vulnerability patches to keep your site safe.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized code and performance-first approach ensures your site stays blazing fast.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Get help from our dedicated support team with average response time under 2 hours.",
  },
  {
    icon: Code,
    title: "Clean Code",
    description: "Well-documented, WordPress coding standards compliant code that's easy to customize.",
  },
  {
    icon: TrendingUp,
    title: "Regular Updates",
    description: "Stay current with WordPress updates and get new features added regularly.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Each plugin goes through rigorous testing to ensure the highest quality standards.",
  },
];

export function Benefits() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our Plugins?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re committed to delivering exceptional WordPress plugins that help your business grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-background hover:shadow-lg">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
