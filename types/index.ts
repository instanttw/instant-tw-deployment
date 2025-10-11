export type PricingTier = "free" | "pro" | "agency" | "enterprise";

export interface Screenshot {
  url: string;
  caption: string;
}

export interface Plugin {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
  productUrl?: string;
  freeDownloadUrl?: string;
  rating: number;
  totalReviews: number;
  installations: number;
  featured: boolean;
  pricing: {
    free?: PricingFeatures;
    pro?: PricingFeatures;
    agency?: PricingFeatures;
    enterprise?: PricingFeatures;
  };
  screenshots: Screenshot[];
  videoUrl?: string;
  features: Feature[];
  faqs: FAQ[];
  changelog: ChangelogEntry[];
  compatibility: {
    wordpress: string;
    woocommerce?: string;
    php?: string;
    mysql?: string;
    plugins?: string[];
    pageBuilders?: string[];
    seoTools?: string[];
    multisite?: boolean;
    cachingPlugins?: string[];
    [key: string]: any;
  };
  testimonials: Testimonial[];
  relatedPlugins: string[];
}

export interface PricingFeatures {
  price: number;
  billingCycle: "monthly" | "annual";
  features: string[];
  limits?: {
    sites?: number;
    supportLevel?: string;
    updates?: string;
  };
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
  tier?: PricingTier[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface Testimonial {
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating: number;
  content: string;
  pluginId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  purchases: Purchase[];
  role: "customer" | "admin";
}

export interface Purchase {
  id: string;
  pluginId: string;
  tier: PricingTier;
  licenseKey: string;
  activationLimit: number;
  activations: number;
  purchaseDate: string;
  expiryDate?: string;
  status: "active" | "expired" | "cancelled";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  pluginCount: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  attachments?: string[];
}
