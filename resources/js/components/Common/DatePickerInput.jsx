import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { Calendar } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function DatePickerInput({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    className = "",
    displayFormat = "YYYY-MM-DD",
}) {
    const [date, setDate] = useState(value ?? null);

    const handleChange = (newValue) => {
        setDate(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <div className="relative w-full">
            <Datepicker
                value={date}
                onChange={handleChange}
                displayFormat={displayFormat}
                inputClassName={twMerge(
                    "w-full rounded-md border border-secondary-300 shadow-sm " +
                        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 " +
                        "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
                        "placeholder:text-xs placeholder:italic placeholder-secondary-400 dark:placeholder-secondary-500",
                    className
                )}
                placeholder={placeholder}
                toggleIcon={() => (
                    <Calendar className="w-4 h-4 text-secondary-500" />
                )}
                popoverDirection="down" // biar dropdown ke bawah
            />
        </div>
    );
}
