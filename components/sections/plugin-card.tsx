"use client";

import { Plugin } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, ArrowRight } from "lucide-react";
import { formatNumber, formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
// import { useTranslations } from "next-intl"; // DISABLED
import { useCurrency } from "@/lib/currency-context";

interface PluginCardProps {
  plugin: Plugin;
  index?: number;
}

// Mock translations
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    free: "Free",
    viewDetails: "View Details",
    getStarted: "Get Started",
    downloads: "Downloads",
    rating: "Rating",
    downloadFree: "Download Free",
    getPro: "Get Pro",
    quickFeatures: "Quick Features:",
    proFrom: "Pro from",
    from: "From",
    perYear: "/year",
    perMonth: "/month"
  };
  return translations[key] || key;
};

export function PluginCard({ plugin, index = 0 }: PluginCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { symbol } = useCurrency();
  const t = mockT; // Use mock translations
  
  const lowestPrice = plugin.pricing.free 
    ? 0 
    : Math.min(
        ...Object.values(plugin.pricing)
          .filter((p): p is NonNullable<typeof p> => p !== undefined && p !== null && "price" in p)
          .map(p => p.price)
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {plugin.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight mb-1">
                  {plugin.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {plugin.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {plugin.tagline}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{plugin.rating}</span>
              <span className="text-muted-foreground">({formatNumber(plugin.totalReviews)})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>{formatNumber(plugin.installations)}</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? "auto" : 0 
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4 pt-4 border-t"
          >
            <p className="text-xs text-muted-foreground mb-2 font-medium">{t("quickFeatures")}</p>
            <ul className="text-xs space-y-1">
              {plugin.pricing.free?.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </CardContent>

        <CardFooter className="relative flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <div>
              {lowestPrice === 0 ? (
                <div>
                  <span className="text-2xl font-bold">{t("free")}</span>
                  <p className="text-xs text-muted-foreground">
                    {t("proFrom")} {symbol}{plugin.pricing.pro?.price}/{plugin.pricing.pro?.billingCycle === 'annual' ? t("perYear") : t("perMonth")}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-muted-foreground">{t("from")}</span>
                  <div className="text-2xl font-bold">{symbol}{lowestPrice}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {/* Download Free Button */}
            {plugin.freeDownloadUrl && (
              <Button asChild variant="outline" className="w-full">
                <a 
                  href={plugin.freeDownloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("downloadFree")}
                </a>
              </Button>
            )}
            {/* Buy Pro Button */}
            {plugin.productUrl && (
              <Button asChild className="w-full group">
                <a 
                  href={plugin.productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t("getPro")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            )}
            {/* Details Button */}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href={`/plugins/${plugin.slug}`}>
                {t("viewDetails")}
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
