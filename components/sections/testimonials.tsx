"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStart Inc",
    avatar: "SJ",
    rating: 5,
    content: "These plugins transformed our WordPress site. The SEO toolkit alone increased our organic traffic by 150% in just 3 months. Outstanding quality and support!",
  },
  {
    name: "Michael Chen",
    company: "E-Commerce Pro",
    avatar: "MC",
    rating: 5,
    content: "The WooCommerce Boost plugin is a game-changer. Our conversion rate improved by 45% and the customer experience is so much better. Worth every penny!",
  },
  {
    name: "Emily Rodriguez",
    company: "Creative Agency",
    avatar: "ER",
    rating: 5,
    content: "As an agency managing 50+ client sites, these plugins save us countless hours. The white-label options and bulk management features are incredible.",
  },
  {
    name: "David Thompson",
    company: "Security Solutions",
    avatar: "DT",
    rating: 5,
    content: "Security Shield gave us peace of mind. It blocked over 10,000 attacks last month alone. The real-time monitoring and detailed reports are fantastic.",
  },
];

export function Testimonials() {
  const t = useTranslations("home");
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{t(`testimonials.items.${index}.name`)}</div>
                      <div className="text-sm text-muted-foreground">{t(`testimonials.items.${index}.company`)}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &quot;{t(`testimonials.items.${index}.content`)}&quot;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
