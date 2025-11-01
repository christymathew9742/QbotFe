"use client";

import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
    if (typeof window !== "undefined") {
        const allKeys = Object.keys(localStorage);
        const deleteKeys = allKeys.filter((k) => k.endsWith("-deletedFileKeys"));
        deleteKeys.forEach((k) => {
            localStorage.removeItem(k);
        });
    }

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") return initialValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue] as const;
}

export default useLocalStorage;
