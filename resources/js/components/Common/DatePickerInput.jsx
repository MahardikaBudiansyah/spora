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
    isError = false,
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
    minDate,
    maxDate,
    ...rest
}) {
    const { isDark } = useTheme();
    const isMobile = useMediaQuery("(max-width: 640px)");

    const baseCalendarClasses = twMerge(
        "rounded-lg border border-secondary-200 shadow-none",
        "dark:bg-secondary-800 dark:border-secondary-700"
    );

    const baseWrapperClasses = twMerge(
        "w-full flex flex-row justify-between items-center rounded-md shadow-sm border transition-all " +
            "border-secondary-300 dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
            "hover:border-primary-500 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 ",

        isError &&
            "border-red-500 dark:border-red-500 hover:border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
        disabled &&
            "opacity-50 cursor-not-allowed bg-secondary-100 dark:bg-secondary-700",
        wrapperClassName
    );

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
            containerClassName="w-full"
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
                <div className={baseWrapperClasses}>
                    <input
                        readOnly
                        disabled={disabled}
                        value={value}
                        onClick={!disabled ? openCalendar : undefined}
                        placeholder="Pilih tanggal..."
                        className={twMerge(
                            "w-full border-none outline-none focus:ring-0 ring-0 bg-transparent text-sm px-3 py-2",
                            "placeholder:text-xs placeholder-secondary-400 dark:placeholder:text-secondary-500",
                            disabled ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                    />
                    <Calendar
                        onClick={!disabled ? openCalendar : undefined}
                        className={twMerge(
                            "w-5 h-5 mx-3 transition-colors",
                            isError
                                ? "text-red-500"
                                : "text-secondary-500 dark:text-secondary-400",
                            disabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                        )}
                    />
                </div>
            )}
            {...rest}
            minDate={minDate}
            maxDate={maxDate}
            mapDays={({ date }) => {
                const isOutOfRange = date < minDate || date > maxDate;

                if (isOutOfRange) {
                    return {
                        disabled: true,
                        className: "rmdp-disabled",
                    };
                }
            }}
        />
    );
}
