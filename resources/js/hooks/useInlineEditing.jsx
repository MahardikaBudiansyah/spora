import { useState, useRef } from "react";
import axios from "axios";

export default function useInlineEditing({
    endpoint,
    debounce = 400,
    onUpdated = null,
    transformPayload = (id, field, value) => ({
        id,
        [field]: value,
    }),
}) {
    const [tempValues, setTempValues] = useState({});
    const [savingCell, setSavingCell] = useState(null);
    const [successCell, setSuccessCell] = useState(null);
    const [errorCell, setErrorCell] = useState(null);

    const debounceRef = useRef({});

    const key = (id, field) => `${id}-${field}`;

    const handleChange = (id, field, value, isNew = false) => {
        const cellKey = key(id, field);

        setTempValues((prev) => ({
            ...prev,
            [cellKey]: value,
        }));

        // clear previous debounce
        if (debounceRef.current[cellKey]) {
            clearTimeout(debounceRef.current[cellKey]);
        }

        // jangan update backend untuk row baru
        if (isNew) return;

        // set debounce untuk update
        debounceRef.current[cellKey] = setTimeout(() => {
            updateCell(id, field);
        }, debounce);
    };

    const handleBlur = (id, field, isNew = false) => {
        if (!isNew) updateCell(id, field);
    };

    const updateCell = async (id, field) => {
        // hindari PATCH untuk row baru
        if (String(id).startsWith("new-")) return;

        const cellKey = key(id, field);
        const value = tempValues[cellKey];

        if (value === undefined) return;

        setSavingCell(cellKey);
        setErrorCell(null);
        setSuccessCell(null);

        try {
            await axios.patch(endpoint(id), transformPayload(id, field, value));

            setSuccessCell(cellKey);

            if (onUpdated) onUpdated();

            setTimeout(() => setSuccessCell(null), 1000);
        } catch (err) {
            console.error("Inline update error:", err);
            setErrorCell(cellKey);

            setTimeout(() => setErrorCell(null), 1500);
        } finally {
            setSavingCell(null);
        }
    };

    return {
        tempValues,
        savingCell,
        successCell,
        errorCell,
        handleChange,
        handleBlur,
        updateCell,
    };
}
