import { useEffect, useState } from "react";

// Reads the saved value once on load, then rewrites it to localStorage on every change —
// this is what makes the data survive a page reload.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to write localStorage key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
