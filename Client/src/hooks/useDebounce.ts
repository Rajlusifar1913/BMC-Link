import { useState, useEffect } from "react";

/**
 * useDebounce hook to prevent synchronous re-render thrashing on fast user keystrokes.
 * Keeps controlled text inputs responsive while debouncing expensive array filters.
 *
 * @param value The value to debounce (e.g. search string)
 * @param delay Milliseconds to wait after last update (default: 200ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
