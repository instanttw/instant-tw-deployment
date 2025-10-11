"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Download, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-2 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Trusted by 5,720,000+ WordPress sites
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance"
          >
            Premium & Custom WordPress Plugins
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Built for Success
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 text-lg text-muted-foreground md:text-xl text-balance max-w-2xl mx-auto"
          >
            Transform your WordPress site with our collection of premium plugins.
            Professional features, exceptional support, and regular updates guaranteed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="w-full sm:w-auto group" asChild>
              <Link href="/plugins">
                Browse All Plugins
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Star className="h-6 w-6 fill-primary text-primary" />
                4.9
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Download className="h-6 w-6 text-primary" />
                2M+
              </div>
              <p className="text-sm text-muted-foreground">Active Installs</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Users className="h-6 w-6 text-primary" />
                590K+
              </div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold">10+</div>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
