/**
 * In-Memory Stale-While-Revalidate (SWR) Cache Manager
 * Provides 0ms instant UI hydration on tab switches and background data revalidation.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cacheStore = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default TTL

/**
 * Retrieve cached data if present.
 */
export function getCachedData<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  // If entry exists, return it (even if stale, for SWR pattern)
  return entry.data as T;
}

/**
 * Check if cached data is still fresh (within TTL).
 */
export function isCacheFresh(key: string): boolean {
  const entry = cacheStore.get(key);
  if (!entry) return false;
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Save data to in-memory cache with specified TTL.
 */
export function setCachedData<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Invalidate a specific cache key or all keys matching a prefix.
 */
export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(keyPrefix)) {
      cacheStore.delete(key);
    }
  }
}
