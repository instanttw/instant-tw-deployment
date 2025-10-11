export async function register() {
  try {
    // Edge-compatible listeners
    if (typeof addEventListener === 'function') {
      addEventListener('error', (e: any) => {
        const err = e?.error || e;
        console.error('[edge:error]', err?.message || String(err), err?.stack || err);
      });
      addEventListener('unhandledrejection', (e: any) => {
        console.error('[edge:unhandledRejection]', e?.reason?.message || e?.reason || 'unknown');
      });
    }
    // Intentionally avoid Node.js process listeners to ensure full Edge compatibility
  } catch {}
}
