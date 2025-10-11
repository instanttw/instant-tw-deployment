import { ReactNode } from 'react';

// Force all checkout routes to be dynamic (required for Stripe callbacks)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
