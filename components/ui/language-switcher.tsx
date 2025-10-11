"use client";

import { useEffect, useState } from "react";
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
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "it", name: "Italiano" },
];

export function LanguageSwitcher() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem('preferred-locale');
      if (stored) {
        setLocale(stored);
        return;
      }
      const cookie = document.cookie.split('; ').find((c) => c.startsWith('NEXT_LOCALE='));
      if (cookie) {
        setLocale(cookie.split('=')[1]);
      }
    } catch {}
  }, []);

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
                setLocale(lang.code);
                document.cookie = `NEXT_LOCALE=${lang.code}; Path=/; Max-Age=31536000; SameSite=Lax`;
                localStorage.setItem('preferred-locale', lang.code);
                window.location.reload();
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
