"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  setConsentCookie, 
  getConsentCookie, 
  isConsentValid, 
  generateSessionId,
  type CookieConsentData 
} from "./cookie-utils";

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  consentGiven: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
  openSettings: () => void;
  closeBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = "cookie-consent-preferences";
const CONSENT_KEY = "cookie-consent-given";
const CONSENT_VERSION = "1.0";

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check both cookie and localStorage for consent
    const cookieData = getConsentCookie();
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedPreferences = localStorage.getItem(STORAGE_KEY);

    // Priority: Check cookie first (most reliable)
    if (cookieData && isConsentValid(cookieData)) {
      setConsentGiven(true);
      setPreferences(cookieData.preferences);
      setShowBanner(false);
      
      // Sync to localStorage if not present
      if (!storedConsent) {
        localStorage.setItem(CONSENT_KEY, "true");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cookieData.preferences));
      }
    } 
    // Fallback: Check localStorage
    else if (storedConsent === "true" && storedPreferences) {
      try {
        const prefs = JSON.parse(storedPreferences);
        setConsentGiven(true);
        setPreferences(prefs);
        setShowBanner(false);
        
        // Create cookie from localStorage data
        const consentData: CookieConsentData = {
          preferences: prefs,
          timestamp: new Date().toISOString(),
          sessionId: generateSessionId(),
          version: CONSENT_VERSION,
        };
        setConsentCookie(consentData);
      } catch (error) {
        console.error('Error parsing stored preferences:', error);
        setShowBanner(true);
      }
    } else {
      // No consent found - show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const saveConsentData = (prefs: CookiePreferences) => {
    const consentData: CookieConsentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
      version: CONSENT_VERSION,
    };
    
    // Save to both cookie and localStorage
    setConsentCookie(consentData);
    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    
    // Update state
    setPreferences(prefs);
    setConsentGiven(true);
    setShowBanner(false);
    
    // Initialize services based on preferences
    if (typeof window !== "undefined") {
      if (prefs.analytics) {
        console.log("Analytics enabled");
        // Initialize analytics here (e.g., Google Analytics)
      }
      if (prefs.marketing) {
        console.log("Marketing cookies enabled");
        // Initialize marketing pixels here
      }
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveConsentData(allAccepted);
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsentData(onlyNecessary);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const updatedPrefs = { ...prefs, necessary: true }; // Ensure necessary is always true
    saveConsentData(updatedPrefs);
  };

  const openSettings = () => {
    setShowBanner(true);
  };

  const closeBanner = () => {
    // When user closes without making choice, treat as "reject all" but remember they've seen it
    if (!consentGiven) {
      rejectAll();
    } else {
      setShowBanner(false);
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentGiven,
        preferences,
        showBanner,
        acceptAll,
        rejectAll,
        savePreferences,
        openSettings,
        closeBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
