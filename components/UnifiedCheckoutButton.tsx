"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedCheckoutButtonProps {
  // For dynamic products (individual plugins/services)
  productSlug?: string;
  tierName?: string;
  
  // For static subscriptions (WP Scan, Hosting, Plugin Bundles)
  plan?: string; // 'pro', 'agency', 'enterprise', etc.
  billing?: 'monthly' | 'yearly';
  
  // For legacy static products with direct productId
  productId?: string; // 'hosting-startup', 'plugins-pro', etc.
  billingCycle?: 'monthly' | 'yearly';
  
  // Common props
  quantity?: number;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

export function UnifiedCheckoutButton({
  productSlug,
  tierName,
  plan,
  billing,
  productId,
  billingCycle,
  quantity = 1,
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
}: UnifiedCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCheckout = async () => {
    // Allow guest checkout - no authentication required
    setIsLoading(true);

    try {
      let apiUrl = '';
      let requestBody: any = {};

      // ALL buttons now use the DYNAMIC API
      if (productSlug && tierName) {
        // DYNAMIC API: Individual plugins/services from database
        apiUrl = '/api/checkout/dynamic';
        requestBody = {
          productSlug,
          tierName,
          quantity,
        };
      } else if (plan && billing) {
        // OLD FORMAT - Convert to dynamic API format
        // This should not be used anymore but kept for backward compatibility
        throw new Error('Deprecated button format. Please use productSlug and tierName instead.');
      } else if (productId && billingCycle) {
        // OLD FORMAT - Convert to dynamic API format
        throw new Error('Deprecated button format. Please use productSlug and tierName instead.');
      } else {
        throw new Error('Invalid checkout configuration. Use productSlug and tierName.');
      }

      // Call checkout API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || disabled}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Export convenience components for specific use cases
export function PluginCheckoutButton(props: {
  productSlug: string;
  tierName: string;
  children: React.ReactNode;
  variant?: any;
  size?: any;
  className?: string;
}) {
  return <UnifiedCheckoutButton {...props} />;
}

export function SubscriptionCheckoutButton(props: {
  plan?: string;
  billing?: 'monthly' | 'yearly';
  productId?: string;
  billingCycle?: 'monthly' | 'yearly';
  children: React.ReactNode;
  variant?: any;
  size?: any;
  className?: string;
}) {
  return <UnifiedCheckoutButton {...props} />;
}

export function ServiceCheckoutButton(props: {
  productSlug: string;
  tierName: string;
  children: React.ReactNode;
  variant?: any;
  size?: any;
  className?: string;
}) {
  return <UnifiedCheckoutButton {...props} />;
}
