/**
 * Dedupes overlapping calls: while a run is in flight every caller gets that
 * same promise, and the slot is released once it settles so a failed run can be
 * retried. For work that must happen once however often the caller fires —
 * React effects re-run on every remount, and StrictMode double-invokes them.
 */
export function singleFlight<T = unknown>() {
  let pending: Promise<T> | null = null;

  return (run: () => Promise<T>) => {
    pending ??= run().finally(() => {
      pending = null;
    });
    return pending;
  };
}
