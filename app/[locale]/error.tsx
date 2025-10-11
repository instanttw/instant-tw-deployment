"use client";

import { useEffect } from "react";

export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for diagnostics
    console.error("Locale error boundary:", error?.message, error?.stack, { digest: (error as any)?.digest });
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-4">
        An error occurred while loading this page.
      </p>
      {error?.digest && (
        <p className="text-sm text-muted-foreground mb-4">Error ID: {error.digest}</p>
      )}
      <button 
        onClick={() => reset()} 
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}