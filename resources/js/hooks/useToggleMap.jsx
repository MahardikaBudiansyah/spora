import { useState } from "react";

export default function useToggleMap(initial = {}) {
    const [map, setMap] = useState(initial);

    const toggle = (key) => {
        setMap((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const set = (key, value) => {
        setMap((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const isOpen = (key) => !!map[key];

    const reset = (newMap = {}) => {
        setMap(newMap);
    };

    return { isOpen, toggle, set, reset };
}
