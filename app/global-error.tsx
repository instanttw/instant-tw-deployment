"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error("Global error boundary:", error?.message, error?.stack, { digest: (error as any)?.digest });
  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-semibold mb-2">Application error</h1>
          {error?.digest && (
            <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
          )}
          <button onClick={() => reset()} className="mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground">
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
