import React from "react";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import Toolbar from "react-multi-date-picker/plugins/toolbar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTheme } from "@/contexts/ThemeContext";
import { twMerge } from "tailwind-merge";

import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/layouts/prime.css";
import "react-multi-date-picker/styles/colors/teal.css";
import "/resources/css/styles/cyan.css";

import { Calendar } from "lucide-react";

export default function DatePickerInput({
    wrapperClassName,
    calendarClassName,
    disabled,
    isRange = false,
    isMultiple = false,
    value,
    onChange,
    numberOfMonths = 1,
    highlightToday = true,
    showOtherDays = true,
    calendarPosition = "bottom-center",
    dateSeparator = " ~ ",
    withDatePanel = false,
    withToolbar = false,
    layout = "default",
    zIndex,
    ...rest
}) {
    const { isDark } = useTheme();
    const isMobile = useMediaQuery("(max-width: 640px)");

    const baseCalendarClasses = twMerge(
        "rounded-lg border border-secondary-200 shadow-lg",
        "dark:bg-secondary-800 dark:border-secondary-700"
    );

    const baseWrapperClasses = `
      w-full flex flex-row justify-between items-center rounded-md border border-secondary-300 shadow-sm
      focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500
      hover:border-primary-500 dark:hover:border-primary-500
      dark:border-secondary-600 dark:bg-secondary-800 dark:text-white
    `;

    // ✅ Handle perubahan value
    const handleChange = (newVal) => {
        if (isRange) {
            onChange?.({
                start: newVal[0] ? new Date(newVal[0]) : null,
                end: newVal[1] ? new Date(newVal[1]) : null,
            });
        } else if (isMultiple) {
            onChange?.(
                Array.isArray(newVal) ? newVal.map((d) => new Date(d)) : []
            );
        } else {
            // Single date → kirim Date tunggal
            onChange?.(newVal ? new Date(newVal) : null);
        }
    };

    const pickerValue = isRange
        ? [value?.start || null, value?.end || null]
        : isMultiple
        ? value || []
        : value || null;

    const adaptiveLayout = isMobile ? "mobile" : layout;

    const plugins = [];
    if (withDatePanel) {
        plugins.push(<DatePanel position="right" key="panel" />);
    }
    if (withToolbar) {
        plugins.push(
            <Toolbar
                position="bottom"
                names={{
                    today: "Hari ini",
                    deselect: "Hapus",
                    close: "Tutup",
                }}
                key="toolbar"
            />
        );
    }

    return (
        <DatePicker
            value={pickerValue}
            onChange={handleChange}
            format="DD/MM/YYYY"
            range={isRange}
            multiple={isMultiple}
            numberOfMonths={numberOfMonths}
            highlightToday={highlightToday}
            showOtherDays={showOtherDays}
            calendarPosition={calendarPosition}
            dateSeparator={dateSeparator}
            disabled={disabled}
            zIndex={zIndex}
            portal
            className={twMerge(
                "rmdp-cyan cyan",
                `rmdp-${adaptiveLayout}`,
                baseCalendarClasses,
                calendarClassName,
                isDark ? "dark" : ""
            )}
            plugins={plugins}
            placeholder="Pilih tanggal..."
            render={(value, openCalendar) => (
                <div
                    className={twMerge(
                        baseWrapperClasses,
                        disabled &&
                            "opacity-50 cursor-not-allowed bg-secondary-100 dark:bg-secondary-700",
                        wrapperClassName
                    )}
                >
                    <input
                        readOnly
                        disabled={disabled}
                        value={value}
                        onClick={openCalendar}
                        placeholder="Pilih tanggal..."
                        className={twMerge(
                            "w-full border-none outline-none ring-0 focus:outline-none focus:ring-0 bg-transparent",
                            "placeholder:text-xs placeholder-secondary-400 dark:placeholder-secondary-500",
                            "cursor-pointer"
                        )}
                    />
                    <Calendar
                        onClick={openCalendar}
                        className="w-5 h-5 mx-4 text-secondary-500 dark:text-secondary-400 cursor-pointer"
                    />
                </div>
            )}
            {...rest}
        />
    );
}
