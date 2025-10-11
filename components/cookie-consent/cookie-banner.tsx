"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Shield, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "@/lib/cookie-consent-context";
import type { CookiePreferences } from "@/lib/cookie-consent-context";

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, savePreferences, closeBanner, preferences } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  if (!showBanner) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSavePreferences = () => {
    savePreferences(localPreferences);
    setShowSettings(false);
  };

  const cookieCategories = [
    {
      id: "necessary",
      title: "Necessary Cookies",
      description: "Essential cookies required for the website to function properly. These cannot be disabled.",
      required: true,
      examples: "Session management, security, basic functionality",
    },
    {
      id: "functional",
      title: "Functional Cookies",
      description: "Enable enhanced functionality and personalization, such as remembering your preferences and settings.",
      required: false,
      examples: "Language preferences, currency selection, theme preferences",
    },
    {
      id: "analytics",
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      required: false,
      examples: "Google Analytics, page views, user behavior tracking",
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      description: "Used to track visitors across websites to display relevant ads and measure campaign effectiveness.",
      required: false,
      examples: "Ad targeting, remarketing, conversion tracking",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] px-4 md:px-6 pb-4 md:pb-6"
      >
        <div className="mx-auto max-w-2xl w-full">
          <div className="bg-background border-2 border-primary/20 rounded-xl shadow-2xl overflow-hidden">
            {/* Simple Banner View */}
            {!showSettings && (
              <div className="p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Cookie className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        We Value Your Privacy
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                        By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or read our{" "}
                        <a href="/privacy" className="text-primary hover:underline font-medium">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="/privacy#cookies" className="text-primary hover:underline font-medium">
                          Cookie Policy
                        </a>.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={acceptAll}
                        className="flex-1 sm:flex-none"
                      >
                        Accept All
                      </Button>
                      <Button
                        onClick={rejectAll}
                        variant="outline"
                        className="flex-1 sm:flex-none"
                      >
                        Reject All
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="secondary"
                        className="flex-1 sm:flex-none"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Cookie Settings
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={closeBanner}
                    className="flex-shrink-0 p-1 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Close banner"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Advanced Settings View */}
            {showSettings && (
              <div className="p-5 md:p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6 text-primary" />
                    Cookie Preferences
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Manage your cookie preferences below. You can enable or disable different categories of cookies. 
                  Note that disabling some cookies may affect your experience on our website.
                </p>

                <div className="space-y-3 mb-5">
                  {cookieCategories.map((category) => (
                    <div
                      key={category.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-secondary/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Switch
                              checked={localPreferences[category.id as keyof CookiePreferences]}
                              onCheckedChange={(checked) => {
                                if (!category.required) {
                                  setLocalPreferences((prev) => ({
                                    ...prev,
                                    [category.id]: checked,
                                  }));
                                }
                              }}
                              disabled={category.required}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold flex items-center gap-2">
                                {category.title}
                                {category.required && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                    Required
                                  </span>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSection(category.id)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors ml-2"
                          >
                            {expandedSections[category.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedSections[category.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-4 bg-secondary/10 border-t"
                        >
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Examples:</span>
                              <p className="text-muted-foreground mt-1">
                                {category.examples}
                              </p>
                            </div>
                            {category.required && (
                              <p className="text-xs text-muted-foreground italic">
                                These cookies are essential for the website to function and cannot be disabled.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={acceptAll}
                    variant="outline"
                    className="flex-1"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  For more information, please read our{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
