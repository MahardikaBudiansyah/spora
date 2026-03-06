import TextInput from "@/components/Common/TextInput";
import PasswordInput from "@/components/Common/PasswordInput";
import NumericInput from "@/components/Common/NumericInput";
import Textarea from "@/components/Common/Textarea";
import SelectInput from "@/components/Common/SelectInput";
import TimePickerInput from "@/components/Common/TimePickerInput";
import DatePickerInput from "@/components/Common/DatePickerInput";

import { Hourglass, SquareCheckBig, SquareX } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function InlineEditingCell({
    value,
    col,
    row,
    rowIndex,
    handleChange,
    handleBlur,
    focusedField,
    setFocusedField,
    savingCell,
    successCell,
    errorCell,
}) {
    const key = `${row.id}-${col.key}`;
    const isFocused = focusedField === key;

    const inputComponents = {
        text: TextInput,
        password: PasswordInput,
        number: NumericInput,
        textarea: Textarea,
        select: SelectInput,
        time: TimePickerInput,
        date: DatePickerInput,
    };

    const CellInput = inputComponents[col.inputType] || TextInput;

    return (
        <div className="relative">
            <CellInput
                value={value}
                onValueChange={(val) => handleChange(row.id, col.key, val)}
                onBlur={() => handleBlur(row.id, col.key)}
                isFocused={isFocused}
                keepCaretOnFocus={true}
                meta={{ row, rowIndex, col }}
                className={twMerge(
                    "text-xs text-center",
                    savingCell === key ? "opacity-80" : "",
                    successCell === key
                        ? "border-green-500 ring-2 ring-green-500"
                        : "",
                    errorCell === key
                        ? "border-red-500 ring-2 ring-red-500"
                        : ""
                )}
                {...(CellInput === TextInput ? { variant: "inline-edit" } : {})}
            />
            {savingCell === key && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 text-xs">
                    <Hourglass className="w-4 h-4" />
                </span>
            )}
            {successCell === key && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 text-xs">
                    <SquareCheckBig className="w-4 h-4" />
                </span>
            )}
            {errorCell === key && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 text-xs">
                    <SquareX className="w-4 h-4" />
                </span>
            )}
        </div>
    );
}
