"use client";

import { featuredPlugins } from "@/config/plugins";
import { PluginCard } from "./plugin-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function FeaturedPlugins() {
  const t = useTranslations("home");
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("featuredPlugins.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("featuredPlugins.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuredPlugins.slice(0, 8).map((plugin, index) => (
            <PluginCard key={plugin.id} plugin={plugin} index={index} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/plugins">
            <Button size="lg" variant="outline" className="group">
              {t("featuredPlugins.viewAll")}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
