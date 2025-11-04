import { useState } from "react";

// ----------------------------------------------------------------------

export default function useSessionStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);

      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }

      const valueToStore =
        typeof defaultValue === "string"
          ? defaultValue
          : JSON.stringify(defaultValue);
      sessionStorage.setItem(key, valueToStore);
      return defaultValue;
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);

      // Store the default value in case of error
      const valueToStore =
        typeof defaultValue === "string"
          ? defaultValue
          : JSON.stringify(defaultValue);
      try {
        sessionStorage.setItem(key, valueToStore);
      } catch (storageError) {
        console.error("Error storing default value:", storageError);
      }

      return defaultValue;
    }
  });

  const setValue = (newValueOrUpdater) => {
    try {
      let newValue;

      if (typeof newValueOrUpdater === "function") {
        newValue = newValueOrUpdater(storedValue);
      } else {
        newValue = newValueOrUpdater;
      }

      const valueToStore =
        typeof newValue === "string" ? newValue : JSON.stringify(newValue);
      sessionStorage.setItem(key, valueToStore);

      setStoredValue(newValue);
    } catch (error) {
      console.error("Error updating sessionStorage:", error);
    }
  };

  const removeValue = () => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error("Error removing item from sessionStorage:", error);
    }
  };

  return [storedValue, setValue, removeValue];
}
