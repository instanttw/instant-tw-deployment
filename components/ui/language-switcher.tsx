"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState(currentLocale);

  useEffect(() => {
    setLocale(currentLocale);
  }, [currentLocale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              try {
                // Don't do anything if already on this locale
                if (lang.code === currentLocale) return;
                
                // Remove current locale from pathname
                let newPath = pathname;
                if (currentLocale !== 'en') {
                  newPath = pathname.replace(`/${currentLocale}`, '') || '/';
                }
                
                // Add new locale prefix (except for English)
                if (lang.code !== 'en') {
                  newPath = `/${lang.code}${newPath === '/' ? '' : newPath}`;
                }
                
                // Navigate to new locale URL
                router.push(newPath);
              } catch (e) {
                console.warn('Locale switch failed', e);
              }
            }}
            className={locale === lang.code ? "bg-accent" : ""}
          >
            {lang.name} ({lang.code.toUpperCase()})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
