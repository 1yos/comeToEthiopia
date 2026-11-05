import { useState, useEffect } from "react";

/**
 * Debounce any value by `delay` ms.
 * Use for search inputs so filtering doesn't run on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
