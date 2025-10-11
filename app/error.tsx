"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log full error for diagnostics in production
    console.error("App error boundary:", error?.message, error?.stack, { digest: (error as any)?.digest });
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      {error?.digest && (
        <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
      )}
      <button onClick={() => reset()} className="mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground">
        Try again
      </button>
    </div>
  );
}
