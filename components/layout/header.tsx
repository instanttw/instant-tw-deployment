"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { SearchModal } from "@/components/search/search-modal";
import { UserAvatarMenu } from "@/components/dashboard/user-avatar-menu";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("header");
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Instant" width={120} height={32} className="h-8 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/wp-scan" className="text-sm font-medium transition-colors hover:text-primary">
              {t("wpScan")}
            </Link>
            <Link href="/services/hosting" className="text-sm font-medium transition-colors hover:text-primary">
              {t("hosting")}
            </Link>
            <Link href="/services/themes" className="text-sm font-medium transition-colors hover:text-primary">
              {t("themes")}
            </Link>
            <Link href="/plugins" className="text-sm font-medium transition-colors hover:text-primary">
              {t("plugins")}
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
                {t("services")}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-background border rounded-lg shadow-lg py-2">
                  <Link href="/services/maintenance" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    {t("maintenancePlans")}
                  </Link>
                  <Link href="/services/speed-optimization" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    {t("speedOptimization")}
                  </Link>
                  <Link href="/services/security" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    {t("securityServices")}
                  </Link>
                  <Link href="/services/seo" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">
                    {t("seoServices")}
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              {t("pricing")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <CurrencySwitcher />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => setSearchModalOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex">
            <UserAvatarMenu />
          </div>

          <Link href="/plugins" className="hidden md:block">
            <Button size="sm">{t("browsePlugins")}</Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto flex flex-col space-y-4 p-4">
            <Link href="/wp-scan" className="text-sm font-medium transition-colors hover:text-primary">
              {t("wpScan")}
            </Link>
            <Link href="/services/hosting" className="text-sm font-medium transition-colors hover:text-primary">
              {t("hosting")}
            </Link>
            <Link href="/services/themes" className="text-sm font-medium transition-colors hover:text-primary">
              {t("themes")}
            </Link>
            <Link href="/plugins" className="text-sm font-medium transition-colors hover:text-primary">
              {t("plugins")}
            </Link>
            <div className="border-l-2 border-primary pl-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">{t("services")}</p>
              <Link href="/services/maintenance" className="block text-sm font-medium transition-colors hover:text-primary">
                {t("maintenancePlans")}
              </Link>
              <Link href="/services/speed-optimization" className="block text-sm font-medium transition-colors hover:text-primary">
                {t("speedOptimization")}
              </Link>
              <Link href="/services/security" className="block text-sm font-medium transition-colors hover:text-primary">
                {t("securityServices")}
              </Link>
              <Link href="/services/seo" className="block text-sm font-medium transition-colors hover:text-primary">
                {t("seoServices")}
              </Link>
            </div>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              {t("pricing")}
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <div className="flex gap-2">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>
              <div className="flex">
                <UserAvatarMenu />
              </div>
              <Button className="w-full">{t("browsePlugins")}</Button>
            </div>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </header>
  );
}
