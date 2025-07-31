import { useState, useEffect } from "react";

export default function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedVAlue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear timeout if value changes or component unmounts
        return () => {
            clearTimeout(handler);
        };
    });

    return debouncedVAlue;
}