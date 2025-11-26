import { useState, useEffect } from "react";

/**
 * Hook that delays updating the value until after wait time
 * @param {any} value The value to debounce
 * @param {number} delay The delay in milliseconds
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

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
