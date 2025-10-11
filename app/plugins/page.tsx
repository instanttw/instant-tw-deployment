"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PluginCard } from "@/components/sections/plugin-card";
import { featuredPlugins, categories } from "@/config/plugins";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type SortOption = "popular" | "rating" | "newest" | "price-low" | "price-high";

export default function PluginsPage() {
  const t = useTranslations("plugins");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const filteredPlugins = useMemo(() => {
    let filtered = [...featuredPlugins];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(query) ||
          plugin.tagline.toLowerCase().includes(query) ||
          plugin.description.toLowerCase().includes(query) ||
          plugin.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (plugin) => plugin.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.installations - a.installations;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return 0;
        case "price-low":
        case "price-high": {
          const getPrices = (pricing: typeof a.pricing) => 
            Object.values(pricing)
              .filter((p): p is NonNullable<typeof p> => p !== undefined && p !== null && "price" in p)
              .map((p) => p.price);
          const aPrice = a.pricing.free ? 0 : Math.min(...getPrices(a.pricing));
          const bPrice = b.pricing.free ? 0 : Math.min(...getPrices(b.pricing));
          return sortBy === "price-low" ? aPrice - bPrice : bPrice - aPrice;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              {t("allCategories")}
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.pluginCount}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6 text-sm text-muted-foreground">{t("showing", { count: filteredPlugins.length })}</div>

        {filteredPlugins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlugins.map((plugin, index) => (
              <PluginCard key={plugin.id} plugin={plugin} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noResults")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
            >
              {t("clearFilters")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
