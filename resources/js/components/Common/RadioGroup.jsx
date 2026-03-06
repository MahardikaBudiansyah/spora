import React, { useId } from "react";
import { twMerge } from "tailwind-merge";
import Radio from "@/components/Common/Radio";

export default function RadioGroup({
    name,
    value,
    onChange,
    options = [],
    disabled = false,
    invalid = false,
    size = "md",
    className,
    children,
    label,
    helper,
}) {
    const groupId = useId();

    return (
        <fieldset
            className={twMerge("w-full border-0 p-0 m-0", className)}
            aria-describedby={helper ? `${groupId}-helper` : undefined}
            disabled={disabled}
        >
            {label && (
                <legend
                    className={twMerge(
                        "mb-2 font-medium",
                        size === "sm" ? "text-sm" : "text-base"
                    )}
                >
                    {label}
                </legend>
            )}

            <div
                role="radiogroup"
                aria-invalid={invalid || undefined}
                className={twMerge("flex flex-col gap-2", className)}
            >
                {options.length > 0
                    ? options.map((opt) => (
                          <Radio
                              key={String(opt.value)}
                              name={name}
                              value={opt.value}
                              label={opt.label}
                              description={opt.description}
                              checked={value === opt.value}
                              onChange={onChange}
                              disabled={disabled}
                              invalid={invalid}
                              size={size}
                          />
                      ))
                    : children}
            </div>

            {helper && (
                <p
                    id={`${groupId}-helper`}
                    className={twMerge(
                        "mt-2 transition-colors",
                        size === "sm" ? "text-xs" : "text-sm",
                        invalid ? "text-red-500" : "text-muted-foreground"
                    )}
                >
                    {helper}
                </p>
            )}
        </fieldset>
    );
}
