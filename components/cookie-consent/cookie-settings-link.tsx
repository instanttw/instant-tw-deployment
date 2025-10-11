"use client";

import { useCookieConsent } from "@/lib/cookie-consent-context";
import { Settings } from "lucide-react";

export function CookieSettingsLink() {
  const { openSettings } = useCookieConsent();

  return (
    <button
      onClick={openSettings}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
    >
      <Settings className="h-3 w-3" />
      Cookie Settings
    </button>
  );
}
